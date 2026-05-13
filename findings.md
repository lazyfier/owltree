# Findings & Decisions

## Requirements
- User invoked `planning-with-files` and asked to clean up and fully maintain the project.
- User additionally asked to add configuration for links to other projects.
- Follow project root `AGENTS.md` and keep changes autonomous, scoped, verified, and non-destructive.
- Use persistent plan files in the project root during the task.
- For new project-specific code, default to `projects/<name>/`; this maintenance pass is primarily existing host code/docs, so current files remain in place.

## Research Findings
- The app is React 18 + TypeScript + Vite with `HashRouter` and GitHub Pages base `/owltree/`.
- `src/App.tsx` mounts `ThemeProvider`, uses lazy page routes, and redirects unknown routes to `/`.
- `src/contexts/ThemeContext.tsx` currently supports only `Theme = 'terminal'`; `setTheme` and `toggleTheme` are no-ops.
- README and AGENTS text still describe four switchable themes and localStorage theme persistence, which no longer matches current code.
- Moon Throw is mounted from `src/pages/MoonThrow.tsx`; UI state is exposed by `src/hooks/useGameState.ts`; reducer glue lives in `src/hooks/useGameState/reducer.ts`; pure game logic lives under `src/game/engine`.
- `npm run typecheck` passed before edits.
- `npm run test:unit` currently has 112 passing tests and 1 failing test: `src/test/App.test.tsx` fails because `window.localStorage.setItem` is not a function.
- Node 25 exposes a `globalThis.localStorage` object in this environment, but the object does not implement `setItem` when started with the current `--localstorage-file` condition. That object leaks into Vitest unless the test setup installs a browser-compatible storage shim.
- `npm run lint` scans `.worktrees/moon-throw-ux` even though `.worktrees/` is ignored by git and Vitest. This makes lint fail on auxiliary worktree files outside the main source tree.
- `.DS_Store` files were present throughout the working directory but are already covered by `.gitignore`; they are safe local cleanup targets.
- `dist`, `coverage`, `playwright-report`, and `test-results` were ignored generated outputs in the working directory and were removed to keep the root lean.
- `.worktrees/moon-throw-ux` is a registered Git worktree, so it should be preserved and ignored by root-level tooling instead of deleted.
- `Hero`, `CategoryGrid`, and `ThemeSwitcher` were only reachable through the non-terminal homepage path; after confirming runtime theme is fixed to terminal, they were removed and `Home` now renders `TerminalHome` directly.
- Additional unreferenced components (`CyberSearch`, old moon-throw modal/card/action/stat/dialogue wrappers) had no imports in the active app or tests. They were deleted; typecheck, lint, and full unit tests still pass.
- README, AGENTS, CLAUDE, and `src/data/projects.ts` still described multi-theme switching; those references were aligned with terminal-only runtime behavior.
- Playwright's failure context showed Moon Throw's "返回首页" control is a button, not a link. The E2E selector was stale and has been updated to the current accessible role.
- ESLint can scan generated Playwright output directories if they exist or are created during a concurrent run. `playwright-report`, `test-results`, and `blob-report` should be ignored by ESLint like they are ignored by git.
- Project links are consumed by the host terminal homepage data in `src/data/projects.ts`, so centralized link configuration belongs in `src/config/projectLinks.ts`.
- Vite exposes browser-safe environment variables only when they use the `VITE_` prefix; `.env.example` now documents the optional `VITE_PROJECT_LINK_*` values.
- Built-in Moon Throw must stay as an internal route (`/moon-throw`), while configured `http` and `https` links should open in a new tab.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Prioritize verification failure before cosmetic cleanup | A passing test baseline makes later cleanup safer. |
| Prefer test environment repair over changing app behavior | The app intentionally ignores stored theme values; the failing symptom is the browser-like test API, not production behavior. |
| Update stale docs only where they contradict current implementation | Avoid unnecessary docs churn. |
| Install in-memory `localStorage` and `sessionStorage` in `src/test/setup.ts` | Keeps tests browser-like and isolated despite Node's incomplete process-level storage object. |
| Exclude `.worktrees` from ESLint | Auxiliary worktrees are not part of the main repository verification surface and are already excluded from tests/git. |
| Simplify `Home` to render `TerminalHome` directly | `ThemeContext` only exposes `terminal`, so the alternative homepage branch was dead code. |
| Update docs instead of reintroducing theme switching | Current tests explicitly assert terminal-only behavior and ignoring old theme localStorage values. |
| Treat only `http` and `https` project links as external | Keeps placeholders, app routes, and non-web schemes from triggering `window.open` project navigation. |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Unit suite fails on `window.localStorage.setItem` in `src/test/App.test.tsx` | Added a Vitest setup storage shim and per-test clearing. |
| Lint fails on `.worktrees/moon-throw-ux` | Added `.worktrees` to ESLint ignores and re-ran lint successfully. |
| E2E failed waiting for `link` named `返回首页` | Updated selector to the current `button` role shown in Playwright's page snapshot. |
| ESLint failed with `ENOENT` while Playwright was managing `test-results` | Added Playwright report directories to ESLint ignores and avoided parallel final verification for those tools. |

## Resources
- Project instructions: `/Users/lazyfier/project/owltree/AGENTS.md`
- Planning skill: `/Users/lazyfier/.agents/skills/planning-with-files/SKILL.md`
- App shell: `/Users/lazyfier/project/owltree/src/App.tsx`
- Theme provider: `/Users/lazyfier/project/owltree/src/contexts/ThemeContext.tsx`
- Unit test setup: `/Users/lazyfier/project/owltree/src/test/setup.ts`

## Visual/Browser Findings
- No browser or screenshot findings yet.
