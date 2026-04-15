## 2026-04-15

- Pre-existing E2E failure: `e2e/portal.spec.ts` "navigation back to home works" test times out because it navigates to `/#/moon-throw` then tries to click `text=SYSTEM ONLINE`, but the moon-throw page (`MoonThrow.tsx`) only has a `cd ..` back link — no `SYSTEM ONLINE` text. This is NOT caused by the TerminalHome refactor. Same failure on both pre- and post-refactor builds.
