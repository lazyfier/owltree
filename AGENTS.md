# AGENTS.md — Owltree

Guidelines for AI agents working in this repository.

## Project Overview

Owltree is a personal portal homepage built with React, Vite, and TypeScript. Features a terminal-first UI with four theme options (terminal, galgame, cyber, minimal) and an experimental narrative game "月抛模拟器" (moon-throw simulator).

**Stack**: React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion.

---

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e

# Preview production build
npm run preview
```

---

## Code Style Guidelines

### TypeScript/React

- **Framework**: React 18 with functional components and hooks
- **Types**: Strict TypeScript with explicit return types on exported functions
- **Components**: One component per file, PascalCase naming (`Hero.tsx`, `CategoryGrid.tsx`)
- **Hooks**: Custom hooks in `src/hooks/`, camelCase with `use` prefix (`useGameState.ts`)
- **Imports**: Use path aliases (`@/components`, `@/hooks`, `@/contexts`)

### File Organization

```
owltree/
├── src/
│   ├── components/     # React components
│   │   ├── portal/     # Portal homepage components (Hero, TerminalHome, CategoryGrid)
│   │   ├── moon-throw/ # Game UI components (VNDialogueBox, VNPortrait, etc.)
│   │   ├── layout/     # Layout components (Footer, ThemeSwitcher)
│   │   └── ui/         # Base UI components (Button, Card, Badge)
│   ├── contexts/       # React Context (ThemeContext)
│   ├── pages/          # Page components (Home, Games, Notes, Tools, Trends, MoonThrow)
│   ├── hooks/          # Custom React hooks
│   ├── game/           # Game engine (pure TypeScript)
│   │   ├── engine/     # Core game logic
│   │   ├── data/       # Game data (tags, diseases, partners, events, etc.)
│   │   └── types.ts    # Game type definitions
│   ├── styles/         # Global CSS + page-specific styles
│   │   ├── game.css    # Visual novel game theme
│   │   └── pages/      # Per-page CSS
│   └── lib/            # Utility functions
├── theme/              # HTML prototypes (reference only)
│   ├── moon-throw.html # Original game prototype
│   └── themes/         # Theme prototypes
├── e2e/                # Playwright E2E tests
├── dist/               # Build output
├── docs/               # Design documentation
├── archive/            # Archived/legacy files
└── .sisyphus/          # AI planning files and evidence
```

### CSS/Styling

- **Primary**: Tailwind CSS utility classes
- **Custom**: CSS variables for theme switching (defined in `globals.css`)
- **Themes**: Four themes controlled by `data-theme` attribute (`terminal`, `galgame`, `cyber`, `minimal`)
- **Game Theme**: Independent CSS variable system in `game.css` (cyberpunk neon aesthetic)
- **Pattern**: Use CSS variables for theme-dependent colors: `var(--bg-primary)`, `var(--text-primary)`

### Naming Conventions

- **Components**: PascalCase (`TerminalHome.tsx`)
- **Hooks**: camelCase with `use` prefix (`useTheme`)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Files**: PascalCase for components, camelCase for utilities
- **CSS Classes**: kebab-case for custom classes

---

## UI/UX Patterns

### Theme System

Four themes available, switched via `ThemeContext`:

| Theme | Description |
|-------|-------------|
| `terminal` | Default. CRT scanlines, neon cursor, command-line aesthetic |
| `galgame` | Visual novel style with glitch effects and character panels |
| `cyber` | Cyberpunk with neon glows and tech aesthetic |
| `minimal` | Clean, whitespace-focused design |

Theme switching:
- Uses CSS custom properties (variables)
- `data-theme` attribute on root element
- Persists to localStorage
- Smooth transitions between themes

### Common Components

- **Button**: `Button.tsx` with variants (primary, secondary, ghost)
- **Card**: `Card.tsx` for content containers
- **Badge**: `Badge.tsx` for tags and labels
- **ParticleBackground**: Animated particle effect background

---

## Game Engine (月抛模拟器)

The "月抛模拟器" game uses a pure TypeScript engine in `src/game/`:

### Architecture

- **Engine**: Deterministic game logic with RNG
- **State**: Managed via `useGameState` hook
- **UI**: Visual novel style with dialogue boxes, ASCII portraits, and choice buttons
- **Tests**: Full unit test coverage with Vitest (94 tests)

### Key Components

| Component | Description |
|-----------|-------------|
| `VNDialogueBox.tsx` | Typewriter effect dialogue display |
| `VNPortrait.tsx` | ASCII art character portraits |
| `VNChoices.tsx` | Action selection buttons |
| `GameContainer.tsx` | Main game layout (split-screen design) |

### Game Systems

- **Dialogue System**: Multi-turn conversations with partner characters
- **Event System**: Random events that trigger during gameplay
- **Achievement System**: Tracks unlocked achievements and endings
- **Difficulty Progression**: Disease probability increases with turns
- **Panic Mode**: Special visual effects when anxiety is high

### Game Data Files

- `tags.ts` — Partner attribute tags (30+ tags)
- `diseases.ts` — Disease definitions (7 types)
- `partners.ts` — Partner templates (10+ characters with ASCII portraits)
- `events.ts` — Random event templates (15 events)
- `achievements.ts` — Achievement definitions
- `endings.ts` — Game ending definitions
- `dialogues.ts` — Preset dialogue trees
- `flirtLines.ts` — Partner dialogue lines (60+ lines)

---

## Testing

- **Unit**: Vitest for game logic and utilities (`npm run test:unit`)
- **E2E**: Playwright for UI flows (`npm run test:e2e`)
- **Coverage**: 94 tests covering game engine, actions, and conditions

---

## Theme Directory

`theme/` contains HTML/CSS prototypes used as visual references:

- Not part of the build
- Reference implementations for UI design
- `theme/moon-throw.html` — original game prototype

---

## Archive Directory

`archive/` contains unused/legacy files for reference:

```
archive/
├── docs/               # Old documentation
├── screenshots/        # Old screenshot files
├── prototypes/         # Moved from prototypes/ directory
├── sisyphus-plans/     # Old AI planning files
└── legacy-components/  # Deleted React components
```

---

## Terminal Theme Implementation

The terminal theme uses **completely different layouts** per page:

| Page | Terminal Layout | Command Style |
|------|----------------|---------------|
| Notes | `ls -la` file listing | Permissions, dates, type icons, tags |
| Games | `ps aux` process table | PID, STATUS, progress bars, tags |
| Tools | `neofetch` system info | ASCII header, system stats, categorized list |
| Trends | `top` monitor | PID, %CPU indicator, topic, source, status |

---

## Game UI Layout

The visual novel game uses a **split-screen desktop layout**:

```
┌─────────────────────┬─────────────────────┐
│                     │                     │
│  Header + Stats     │  Action Buttons     │
│                     │                     │
├─────────────────────┼─────────────────────┤
│                     │                     │
│                     │                     │
│   ASCII Portrait    │   Dialogue Box      │
│   + Tags            │   / Choice Buttons  │
│                     │                     │
│                     │                     │
└─────────────────────┴─────────────────────┘
```

- **Fixed 50/50 split** — CSS Grid ensures stable layout
- **Full viewport** — Uses `h-screen w-screen`, no scrolling
- **Cyberpunk theme** — Cyan (#00f0ff) + Pink (#ff006e) neon colors

---

## Anti-Patterns to Avoid

1. **Don't import from barrel files** — Import directly from source
2. **Don't use `any`** — Strict typing required
3. **Don't mix theme logic** — Keep theme-specific styles in CSS variables
4. **Don't modify game engine** — Keep pure TypeScript, no React dependencies

---

## Deployment

GitHub Actions auto-deploys to GitHub Pages on push to `main`.

---

*Last updated: Visual novel game enhancement complete — 94 tests passing*
