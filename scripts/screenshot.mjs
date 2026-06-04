/**
 * One-shot Puppeteer screenshot capture for the CAPilot marketing site.
 *
 *   node scripts/screenshot.mjs
 *
 * Runs against the live local dev server (frontend at :5173 + backend
 * at :3000). Logs in as Browser User (Partner of FirmId 101 — the
 * trial firm seeded earlier), captures the key product surfaces, and
 * saves them under static/img/screens/.
 *
 * Public pages first (no auth needed) so the build never blocks on
 * a missing session. Authed pages after login.
 */
import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'static/img/screens');
mkdirSync(OUT, { recursive: true });

const SHOTS = {
  public: [
    { name: '01-pricing',       url: 'http://localhost:5173/pricing',                wait: 2500 },
    { name: '02-tax-calculator',url: 'http://localhost:5173/tools/tax-calculator',  wait: 3500 },
    { name: '03-gstin-lookup',  url: 'http://localhost:5173/tools/gstin-lookup',    wait: 2000 },
    { name: '04-mca-lookup',    url: 'http://localhost:5173/tools/mca-lookup',      wait: 2000 },
    { name: '05-hsn-finder',    url: 'http://localhost:5173/tools/hsn-rate-finder', wait: 3000 },
    { name: '06-login',         url: 'http://localhost:5173/login',                  wait: 1500 },
    { name: '07-register',      url: 'http://localhost:5173/register',               wait: 2500 },
  ],
  authed: [
    { name: '10-dashboard',           url: 'http://localhost:5173/dashboard',                      wait: 3000 },
    { name: '11-compliance-calendar', url: 'http://localhost:5173/practice/compliance/calendar', wait: 3000 },
    { name: '12-compliance-tasks',    url: 'http://localhost:5173/practice/complianceTasks',     wait: 3000 },
    { name: '13-clients-list',        url: 'http://localhost:5173/clientSetup/clients',          wait: 3000 },
    { name: '14-communications',      url: 'http://localhost:5173/practice/communications',      wait: 3000 },
    { name: '15-invoices',            url: 'http://localhost:5173/finance/invoices',             wait: 3000 },
    { name: '16-time-entries',        url: 'http://localhost:5173/practice/timeEntries',         wait: 3000 },
    { name: '17-tax-scenarios',       url: 'http://localhost:5173/practice/tax-scenarios',       wait: 3000 },
    { name: '18-gstr1-export',        url: 'http://localhost:5173/practice/gstr1-returns',       wait: 3000 },
    { name: '19-firm-billing',        url: 'http://localhost:5173/firm/billing',                  wait: 3000 },
  ],
};

/**
 * Tracks in-flight /api/ requests on the page, ignoring realtime SSE /
 * long-poll endpoints (which never go idle). Returns a state object the
 * caller can poll via `waitForApiIdle`.
 *
 * Why: CAPilot's DataGrid (see DataGrid.jsx :570) defers its first list
 * fetch until /api/GridPreferences resolves. Those calls can take 1-3
 * seconds each (StrictMode fires twice in dev). A simple spinner-absence
 * check returns too early — the spinner appears only WHILE fetching, so
 * "no spinner" reports true *before* the prefs even land, and we
 * screenshot the empty initial render. Counting in-flight requests
 * captures the full prefs → list → render chain.
 */
function installApiTracker(page) {
  const state = { inFlight: 0, lastChange: Date.now() };
  const tracked = (req) => {
    const u = req.url();
    return u.includes('/api/') && !u.includes('/api/realtime/');
  };
  page.on('request',         (req) => { if (tracked(req)) { state.inFlight++; state.lastChange = Date.now(); } });
  page.on('requestfinished', (req) => { if (tracked(req)) { state.inFlight = Math.max(0, state.inFlight - 1); state.lastChange = Date.now(); } });
  page.on('requestfailed',   (req) => { if (tracked(req)) { state.inFlight = Math.max(0, state.inFlight - 1); state.lastChange = Date.now(); } });
  return state;
}

async function waitForApiIdle(state, { idleMs = 1500, timeoutMs = 25000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (state.inFlight === 0 && Date.now() - state.lastChange >= idleMs) return true;
    await new Promise((r) => setTimeout(r, 100));
  }
  return false;
}

async function waitForRender(page, apiState) {
  // Brief pre-pad so the SPA has time to MOUNT and start dispatching
  // its first request before we begin counting idle. Without it we'd
  // catch the post-navigation "0 in-flight" window and exit instantly.
  await new Promise((r) => setTimeout(r, 800));
  await waitForApiIdle(apiState, { idleMs: 1500, timeoutMs: 25000 });
  // Belt-and-braces: ensure any spinners that survive past the API idle
  // window (CSS transitions, late animations) have cleared.
  try {
    await page.waitForFunction(() => {
      return document.querySelectorAll('.ant-spin-spinning, .ant-skeleton-active').length === 0;
    }, { timeout: 4000, polling: 200 });
  } catch { /* tolerated */ }
  await new Promise((r) => setTimeout(r, 500));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    const apiState = installApiTracker(page);

    // --- Public pages (no auth) ---
    for (const s of SHOTS.public) {
      console.log(`→ ${s.name}: ${s.url}`);
      await page.goto(s.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await waitForRender(page, apiState);
      await page.screenshot({ path: path.join(OUT, `${s.name}.png`), fullPage: false });
    }

    // --- Login as Browser User (Partner of FirmId 101) ---
    console.log('→ logging in…');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));
    // antd Form generates input ids from Form.Item names.
    await page.type('#username', 'browser-owner2@example.com');
    await page.type('#password', 'browsertrial1');
    await page.click('button[type="submit"]');

    // SPA navigation — wait for the URL to leave /login AND for the
    // dashboard's 'Welcome back' header to render. waitForNavigation
    // doesn't fire for client-side route changes in Vite, so poll.
    await page.waitForFunction(() => !location.pathname.startsWith('/login'),
      { timeout: 15000 });
    await page.waitForSelector('h2, h3, h4', { timeout: 10000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2500));   // let bootstrap + sidebar render

    // --- Authed pages ---
    for (const s of SHOTS.authed) {
      console.log(`→ ${s.name}: ${s.url}`);
      await page.goto(s.url, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
      // Detect a bounce-to-login and re-login (defensive).
      if (page.url().includes('/login')) {
        console.log('  ↺ bounced to login, re-authenticating…');
        await new Promise(r => setTimeout(r, 1000));
        await page.type('#username', 'browser-owner2@example.com').catch(() => {});
        await page.type('#password', 'browsertrial1').catch(() => {});
        await page.click('button[type="submit"]').catch(() => {});
        await page.waitForFunction(() => !location.pathname.startsWith('/login'),
          { timeout: 15000 }).catch(() => {});
        await new Promise(r => setTimeout(r, 1500));
        await page.goto(s.url, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
      }
      await waitForRender(page, apiState);
      await page.screenshot({ path: path.join(OUT, `${s.name}.png`), fullPage: false });
    }

    console.log(`\n✓ all done — ${SHOTS.public.length + SHOTS.authed.length} screenshots in ${OUT}`);
  } finally {
    await browser.close();
  }
})().catch((err) => { console.error(err); process.exit(1); });
