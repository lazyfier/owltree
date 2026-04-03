# AGENTS.md — Owltree

Guidelines for AI agents working in this repository.

## Project Overview

Owltree is an early-stage project containing interactive HTML prototypes. The main artifact is `other/moon-throw.html` — a Chinese-language moon-throw simulator (月抛模拟器) with glassmorphism UI, canvas-based physics, and Tailwind CSS styling.

**Stack**: Pure HTML/CSS/JavaScript, no build system, no package manager.

---

## Development Commands

No build step required. Files are served statically:

```bash
# Quick local server
python3 -m http.server 8080

# Or with Node.js
npx serve .

# Or with PHP
php -S localhost:8080
```

Open `http://localhost:8080/other/moon-throw.html` in browser.

### No Tests, No Lint

This project has no test framework, no linting, and no CI. Quality assurance is manual.

---

## Code Style Guidelines

### HTML

- Use semantic HTML5 elements (`<header>`, `<main>`, `<section>`, etc.)
- Include `lang="zh-CN"` for Chinese content pages
- Always specify `<meta charset="UTF-8">` and viewport meta
- Load Tailwind via CDN: `https://cdn.tailwindcss.com`
- Structure: Single-file prototypes with inline styles and scripts

### CSS

- **Primary**: Tailwind CSS utility classes
- **Custom**: Inline `<style>` blocks for:
  - Glassmorphism effects (`backdrop-filter`, `rgba()` backgrounds)
  - Complex animations (`@keyframes`)
  - Custom scrollbars
  - Component-specific styles too verbose for utilities
- Color palette: Dark theme with slate/blues (`#020617`, `#0f172a`, `#cbd5e1`)
- Use CSS custom properties sparingly (project preference is inline styles)

### JavaScript

- Vanilla JS only — no frameworks, no build step
- Organize code in logical sections:
  1. Configuration/constants
  2. State management
  3. DOM element references
  4. Event listeners
  5. Helper functions
  6. Main logic
- Use `const` and `let` (no `var`)
- Prefer `document.getElementById()` over `querySelector` for ID lookups
- Event delegation for dynamic elements
- Canvas operations: batch draws, use `requestAnimationFrame` for loops

### Naming Conventions

- **Variables**: camelCase (`gameState`, `currentRound`)
- **Constants**: UPPER_SNAKE_CASE for true constants (`MAX_ROUNDS`)
- **DOM IDs**: kebab-case (`game-container`, `start-btn`)
- **CSS Classes**: kebab-case, semantic (`glass-panel`, `tag-badge`)
- **Files**: kebab-case for multi-word files (`moon-throw.html`)

### File Organization

```
owltree/
├── index.html          # Root placeholder (currently empty)
├── other/              # Prototypes and experiments
│   └── moon-throw.html # Main prototype (1000+ lines)
├── CLAUDE.md           # Project context for Claude Code
└── README.md           # Minimal description
```

- New prototypes go in `other/`
- Root `index.html` reserved for future landing page

---

## UI/UX Patterns

### Glassmorphism

Standard panel styling used throughout:

```css
.glass-panel {
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
}
```

### Typography

- Primary: `'Noto Sans SC', sans-serif` (Chinese support)
- Import from Google Fonts
- Font weights: 400 (normal), 500 (medium), 700 (bold), 900 (black)

### Animations

Use cubic-bezier for pop effects:

```css
transition: all 0.3s ease;
animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

Common animations:
- `popIn`: Scale + fade entrance
- `flipIn`: 3D card flip reveal
- `pulse-stress`: Subtle glow pulse
- `panic-shake`: Screen shake for tension

---

## Anti-Patterns to Avoid

1. **Don't add npm/node_modules** — Keep it zero-dependency
2. **Don't split into separate CSS/JS files** — Single-file prototypes preferred
3. **Don't use external images without fallbacks** — Use Unsplash URLs with fallbacks
4. **Don't use modern ES modules** — Plain script tags only
5. **Don't introduce TypeScript** — Vanilla JS only
6. **Don't add frameworks** — No React, Vue, etc.

---

## Canvas/Physics Guidelines

When working with the canvas physics simulation:

- Use `requestAnimationFrame` for animation loops
- Batch canvas operations (minimize state changes)
- Clear canvas with `clearRect` or fill before redraw
- Use devicePixelRatio for sharp rendering on high-DPI displays
- Physics: Simple Euler integration is sufficient

---

## Chinese Language Support

- Set `lang="zh-CN"` on `<html>`
- Use Noto Sans SC font family
- Test with Chinese text: "月抛模拟器", "开始游戏"
- Ensure proper encoding (UTF-8)

---

## Version Control

- Commit messages: English, present tense ("Add", "Fix", "Update")
- Keep commits atomic (one logical change per commit)
- No pre-commit hooks or conventional commits enforced

---

## Testing Approach

Manual testing only:

1. Open file in browser
2. Test interactions (clicks, drags, animations)
3. Verify canvas rendering at different sizes
4. Check mobile responsiveness (dev tools)
5. Test Chinese text rendering

---

*Last updated: Based on CLAUDE.md and moon-throw.html analysis*
