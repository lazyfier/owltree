
- Task 1 uses `tailwind.config.js` with exact portal token values: deep-sea `#0a0f14`, ink-blue `#111820`, coral `#f97066`, amber-accent `#fbbf24`, rose-accent `#fb7185`.
- `playwright.config.ts` stays minimal: only `testDir` and preview `baseURL`, with no extra web server orchestration added in Task 1.
- Generated outputs (`dist/`, `node_modules/`, `test-results/`) are verification artifacts only and are removed from the intended Task 1 result after checks pass.
- Task 3 uses a named `ParticleBackground` canvas component in `src/components/ui/ParticleBackground.tsx` with teal-only particles and a fixed 80/20-ish circle-to-square mix.
- Reduced motion is handled by returning `null` instead of drawing a static canvas, which keeps the component reliable, route-agnostic, and easy to mount later without animation edge cases.
