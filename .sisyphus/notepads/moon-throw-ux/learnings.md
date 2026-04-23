2026-04-16: Accessibility improvement for decorative moon emoji in GameIntro.tsx
- Action: Added aria-hidden="true" to the moon emoji span to hide from screen readers
- Rationale: Decorative element should not be announced by AT; aligns with Code Quality Review feedback.
- Result: Local build succeeded and no UI behavior changes expected.
