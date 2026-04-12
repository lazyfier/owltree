# Issues

## Known Build Errors (Task 1 target)
- `src/hooks/useGameState.ts`: ActionType export/use mismatch
- `src/components/moon-throw/ActionButtons.tsx`: unused parameters

## Known Navigation Issues (Task 2 target)
- TerminalHome uses `#/games` hash strings in `navigate()` instead of `/games` paths
- `ARCHIVE` and `CONNECT` chips point to `#` (no route)
- Project rows not clickable despite having `url` field

## Theme Issues (Tasks 3/4 target)
- No visible theme switcher UI
- Secondary pages (Games/Notes/Tools/Trends) use hardcoded colors

## 2026-04-11
- TypeScript build warnings surfaced from unused props/imports after hook/import fixes.
- `useTestkit` was renamed at the call site and in `GameContainer` to avoid hook-rule linting on a non-hook helper.
- Accessibility/lint fixes required explicit `type="button"` on all interactive buttons and `Card` was converted to a real button for keyboard semantics.
