## 2026-04-15
- `@vitest/coverage-v8` must stay aligned with the installed Vitest major/minor; this repo needed `@vitest/coverage-v8@2.1.9` rather than the latest 4.x release.
- `@eslint/js` 10.x requires ESLint 10, but `eslint-plugin-react-hooks` currently peers against ESLint 9, so the compatible baseline here is ESLint 9 + `@eslint/js` 9.
