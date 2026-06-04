# `scripts/` — capture pipeline

## `screenshot.mjs`

Headless Puppeteer capture of CAPilot's public + authed UI for the docs
site. Run while the local stack is up:

```bash
# from this folder's parent
node scripts/screenshot.mjs
```

Requires:

- frontend running at `http://localhost:5173`
- backend running at `http://localhost:3000`
- a seeded Browser Trial Co dataset — see
  `../../CAPilot/backend/scripts/seedDemoData.mjs` (Hari note: run that
  before this script if the screenshots come back empty)

Logs in as the `browser-owner2@example.com` partner, walks 7 public +
10 authed surfaces, and writes PNGs to `../static/img/screens/`. The
docs pages import them by relative path, so a re-shoot is the only
step needed to refresh the site's imagery — commit + push, the GitHub
Actions workflow handles the rest.

## Post-mortem — why this script was rewritten twice

### Round 1: loader spinners in every screenshot

The first version slept a fixed 3 seconds between `page.goto` and
`page.screenshot`. CAPilot's data-driven pages take longer than that,
so the screenshots captured the loading spinner instead of the
rendered content. Switched to polling `.ant-spin-spinning` absence
before screenshotting. Fixed pages with visible spinners (dashboard,
compliance calendar).

### Round 2: grid pages still empty after seeding

Even with real seeded data in the DB and a working real-Chrome session
showing it, the Clients / Invoices / Time Entries / Communications
grids kept screenshotting as "No records to display."

**Why the spinner-absence check was a false signal.** On a `DataGrid`
page (`frontend/src/components/Grid/DataGrid.jsx`) the lifecycle is:

1. Component mounts → renders empty grid skeleton. **No spinner. No
   fetch yet.**
2. `useEffect` fires → calls `listGridPreferences` (`/api/GridPreferences`).
   Spinner *might* appear on the prefs control, not on the main grid.
3. Prefs resolve → `setPrefsReady(true)` (`DataGrid.jsx:578`).
4. A second `useEffect` (gated on `prefsReady`) fires → `fetchServer`.
   *Now* the main grid spinner shows.
5. Records arrive → re-render with rows.

Steps 1–3 take 2–6 seconds in dev because each `GridPreferences` call
is a network round-trip and React StrictMode double-fires the effect.
The empty render in step 1 has no spinner at all — so
`waitForFunction(() => no .ant-spin-spinning)` returned `true`
immediately, I padded 800ms, and screenshotted before the prefs fetch
had even left the browser.

The reason it looked Puppeteer-specific: a real Chrome session is
slower on cold renders (DevTools open, multiple tabs sharing the JS
engine) so by the time you eyeballed it, the chain had completed.
Headless Puppeteer + a fresh profile finishes step 1 faster than the
human reaction time.

**The fix.** Stop polling DOM state, start polling network state.
`installApiTracker(page)` listens for `request` / `requestfinished` /
`requestfailed` events, maintains an in-flight counter, and exposes
its state. `waitForApiIdle(state)` blocks until `inFlight === 0` for a
sustained 1.5 s. `/api/realtime/` is excluded — those are SSE-style
endpoints that never go idle.

That single signal captures the entire prefs → list → render chain
regardless of how many effects deep it goes. It survives future
feature additions (extra widgets, lazy lookup loads) that would have
broken DOM-selector heuristics.

The spinner check is still in `waitForRender`, but only as a
belt-and-braces step *after* API-idle resolves — for catching the
rare case where a CSS transition outlasts the network quiet.

### Generalised lesson

When a UI's fetch chain has gates (`prefsReady`, `permissionsReady`,
`roleResolved`), DOM-loader presence is unreliable because each gate
has a brief windowless period where nothing visible is happening.
Network-quiet is the safer ready-signal for headless-browser capture.
