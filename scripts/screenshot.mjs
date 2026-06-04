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
 * Wait until CAPilot's data has actually rendered. The fixed wait
 * between navigate and screenshot was insufficient: pages with grids /
 * lists kept their loading spinner visible until well past the
 * configured delay. Poll until no antd spin overlay remains on the
 * page, with a per-call ceiling so we don't hang on a real bug.
 */
async function waitForRender(page, timeoutMs = 15000) {
  // Give the SPA time to mount + dispatch its data fetches BEFORE we poll
  // for spinner absence. Otherwise we race the initial render: the
  // spinner hasn't appeared yet so "0 spinners" reports true, and we
  // screenshot a half-mounted page. 1.5s is empirically enough.
  await new Promise((r) => setTimeout(r, 1500));
  try {
    await page.waitForFunction(() => {
      const spinning  = document.querySelectorAll('.ant-spin-spinning').length;
      const skeletons = document.querySelectorAll('.ant-skeleton-active').length;
      const custom    = document.querySelectorAll(
        '.formroute-loader, .datagrid-loader, .app-fullscreen-loader, .login-page-loader',
      ).length;
      return spinning === 0 && skeletons === 0 && custom === 0;
    }, { timeout: timeoutMs, polling: 250 });
  } catch {
    // fall through — screenshot what we've got rather than fail the whole batch
  }
  // DataGrid pages gate their first data fetch on GridPreferences resolving
  // (see DataGrid.jsx :570). When prefs land late + the grid kicks off
  // /api/<Controller> list, we need to also wait for THAT fetch to render
  // its rows. Poll for either real rows or the explicit empty state.
  try {
    await page.waitForFunction(() => {
      // Page hasn't loaded a grid? Skip the wait.
      const grid = document.querySelector('.basegrid-body, .ant-table-tbody, .basegrid-empty, .ant-empty');
      if (!grid) return true;
      // Grid present — wait for rows OR the explicit empty state.
      const rows  = document.querySelectorAll('.basegrid-row, .ant-table-row').length;
      const empty = document.querySelector('.basegrid-empty, .ant-empty-description');
      return rows > 0 || !!empty;
    }, { timeout: 8000, polling: 250 });
  } catch { /* tolerated */ }
  // small safety pad so animations + table renders settle
  await new Promise((r) => setTimeout(r, 800));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    page.on('response', async (resp) => {
      const url = resp.url();
      const status = resp.status();
      if (status >= 400) {
        console.log(`  [resp] ${status} ${url.replace('http://localhost:5173','').replace('http://localhost:3000','')}`);
      } else if (url.includes('/api/')) {
        console.log(`  [api ${status}] ${resp.request().method()} ${url.replace('http://localhost:5173','').replace('http://localhost:3000','')}`);
      }
    });

    // --- Public pages (no auth) ---
    for (const s of SHOTS.public) {
      console.log(`→ ${s.name}: ${s.url}`);
      await page.goto(s.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await waitForRender(page);
      await new Promise(r => setTimeout(r, s.wait));
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
      await waitForRender(page);
      await new Promise(r => setTimeout(r, s.wait));
      await page.screenshot({ path: path.join(OUT, `${s.name}.png`), fullPage: false });
    }

    console.log(`\n✓ all done — ${SHOTS.public.length + SHOTS.authed.length} screenshots in ${OUT}`);
  } finally {
    await browser.close();
  }
})().catch((err) => { console.error(err); process.exit(1); });
