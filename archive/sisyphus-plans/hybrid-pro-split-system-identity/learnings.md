# Learnings — Hybrid Pro Split System Identity

## Task 1: Screen Shell Refactor

### Layout Architecture
- Title row pulled out of right column into a dedicated `.overview-title-row` that spans full width above the grid
- This gives the two-column zone maximum vertical space for identity panel + project rail
- Grid: `280px 1fr` with `align-items: start` — left panel fits content, right zone is dominant
- At 1440px viewport: columns render as `280px 975px` (78% dominant right)

### Viewport Fit
- Title size reduced from `clamp(3rem, 8vw, 6rem)` to `clamp(2.5rem, 6vw, 4.5rem)` — saves ~60px
- Subtitle margin-bottom changed from `50px` to `0` (no longer needed as grid gap handles spacing)
- `overview-title-row` gets `margin-bottom: 32px` for controlled breathing room
- Screen 1 fits exactly 1024px at 1440×1024 with scroll indicator visible

### Key CSS Additions
- `.overview-title-row` — full-width container for title + subtitle
- `.project-rail-zone` — wrapper for the right column's project module area, flex column
- `.content-grid` additions: `flex: 1 1 auto; min-height: 0; align-items: start`

### Parallel Task Interaction
- Task 2 (System Identity content) was applied in parallel — the profile-card already had "Current Focus", "Now Building", "Availability" content at verification time
- Structural changes from Task 1 and content changes from Task 2 are independent and compatible

### Verification Method
- Playwright at 1440×1024 with DOM measurements (this model cannot view images)
- Key metric: `s1Rect.height === 1024` and `scrollRect.bottom <= window.innerHeight`
- Screen 2 check: 6 modules, Games module dominant (span 6 col, span 2 row)
- Console: 0 errors after cursor/hover/scroll interactions

## Task 3: Project Rail Implementation (2026-04-10)

### Horizontal Rail Pattern
- **Structure**: `.project-rail-module > .rail-header + .rail-container > .rail-track > .project-card × N`
- **Constraint chain**: Parent grid `1fr` column → `.project-rail-zone` needs `min-width: 0; overflow: hidden` → `.rail-container` needs `overflow: hidden` → `.rail-track` uses `overflow-x: auto; scroll-snap-type: x mandatory`
- **Critical**: CSS Grid children expand to content size by default. Must add `min-width: 0` + `overflow: hidden` on the rail-zone to prevent the flex track from stretching the grid column.

### Card Design (Showcase Style)
- Fixed-width cards: `flex: 0 0 195px` — uniform, prevents layout shift
- Card layout: vertical flex column with `gap: 12px`, `min-height: 160px`
- Progress section uses `margin-top: auto` to pin to card bottom
- Hover: `translateY(-4px)` lift + top-bar gradient reveal (horizontal `scaleX` instead of vertical `scaleY` from row variant)

### Scroll Indicator JS
- Listen to `scroll` event on `.rail-track` with `{ passive: true }`
- Calculate current index: `Math.round(scrollLeft / (cardWidth + gap)) + 1`
- Use `requestAnimationFrame` double-wrap for reliable state reads after `scrollTo`
- Overflow gradient fade: add/remove `.scrolled-end` class on `.rail-container`

### Key Gotcha
- At default card width (195px × 6 + 5×14px gaps = 1240px), cards fit exactly in the `1fr` column at 1440px viewport. Overflow only triggers at narrower viewports. Testing at 900px viewport confirmed proper scroll behavior.

## Task 3: Active Projects Module — Fixed-Height Internal Scroll

### What was done
- Replaced horizontal `.rail-track` (flex row, `overflow-x: auto`, scroll-snap) with vertical `.module-body` (flex column, `overflow-y: auto`)
- Module wrapper: `max-height: 440px; display: flex; flex-direction: column`
- Header: `flex-shrink: 0` to prevent shrinking when body scrolls
- Body: `flex: 1; overflow-y: auto` with custom thin cyan scrollbar
- Bottom fade affordance: `::after` pseudo-element with `linear-gradient(to bottom, transparent, var(--bg-void))`
- Fade auto-hides via `.scrolled-bottom` class when scrolled to end
- Cards: vertical stack with `margin-top: 10px` gap, left accent bar on hover (scaleY instead of scaleX)
- Card hover: `translateX(4px)` instead of `translateY(-4px)` (horizontal shift for vertical list)

### Key measurements
- Module: 440px fixed height, body gets ~365px after header
- 6 cards × ~120px = ~811px content → 447px scrollable overflow
- Custom scrollbar: 4px width, `rgba(0,240,255,0.25)` thumb

### JS pattern
- `scroll` event on `.module-body` → check `scrollTop + clientHeight >= scrollHeight - 5` → toggle `.scrolled-bottom`
- Card count dynamically read from DOM and set in header

## Task 4: Responsive Hardening & Polish (2026-04-10)

### Responsive Fixes Applied
- **Card title wrapping**: Added `word-break: break-word; overflow-wrap: break-word; min-width: 0` to `.card-title` — prevents long project names from breaking card layout
- **1024px breakpoint enhancements**: Added explicit `max-height: 400px` for project-rail-zone AND project-rail-module (both needed), tighter identity panel padding (24px), reduced gap (24px)
- **600px breakpoint enhancements**: Compact identity panel (18px padding, 20px border-radius), smaller avatar (44px), reduced signal block padding, single-col modules grid, smaller card titles (0.85rem), compact back button (42px)

### Key Insight
- `.project-rail-zone` and `.project-rail-module` both need matching `max-height` constraints — the zone wrapper alone isn't sufficient if the inner module has its own `max-height: 440px` from desktop
- `min-width: 0` on `.card-title` is critical because it's a flex child — without it, the flex item won't shrink below its content size, causing overflow

### Verification Method (No Image Support)
- Playwright snapshot (accessibility tree) confirms DOM structure at each viewport
- JS evaluation via `playwright_browser_evaluate` for computed styles and DOM queries
- Key checks: module count (6), Games grid span (6×2), card title word-break, console errors
- Console: Only favicon 404 (harmless), zero functional errors across all viewports

### Screen 2 Stability
- HTML structure unchanged — no modifications to screen 2 markup
- Only CSS changes in responsive media queries affect how screen 2 renders at smaller viewports
- At 1024px: 2-column grid, Games still spans both columns
- At 600px: single column, all modules stack vertically
