# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Owltree — a personal portal homepage built with React 18, Vite, and TypeScript. Features a terminal-first UI with four theme options (terminal, galgame, cyber, minimal) and an experimental narrative game "月抛模拟器" (moon-throw simulator).

The `theme/` directory contains HTML/CSS prototypes used as visual references (not part of the build).

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + CSS Variables for theming
- **State**: React Context + localStorage for theme persistence
- **Animation**: Framer Motion
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Routing**: HashRouter for GitHub Pages compatibility

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
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

## Repository Structure

```
owltree/
├── src/
│   ├── components/     # React components
│   │   ├── portal/     # Portal homepage components (Hero, TerminalHome, CategoryGrid)
│   │   ├── moon-throw/ # Game UI components
│   │   ├── layout/     # Layout components (Footer, ThemeSwitcher)
│   │   └── ui/         # Base UI components (Button, Card, Badge)
│   ├── contexts/       # React Context (ThemeContext)
│   ├── pages/          # Page components (Home, Games, Notes, Tools, Trends)
│   ├── hooks/          # Custom React hooks
│   ├── game/           # Game engine (pure TypeScript, no React dependency)
│   ├── styles/         # Global CSS with theme variables
│   └── lib/            # Utility functions
├── theme/              # HTML prototypes (reference only, not built)
├── e2e/                # Playwright E2E tests
├── dist/               # Build output
└── docs/               # Design documentation
```

## Key Patterns

### Theme System

Four themes controlled by `data-theme` attribute on root element:
- `terminal` (default): CRT scanlines, neon cursor, command-line aesthetic
- `galgame`: Visual novel style with glitch effects
- `cyber`: Cyberpunk with neon glows
- `minimal`: Clean, whitespace-focused design

Uses CSS custom properties defined in `src/styles/globals.css`.

### Game Engine

Pure TypeScript engine in `src/game/`:
- Deterministic RNG for reproducible tests
- Separate from React UI
- Full unit test coverage

### Component Conventions

- One component per file, PascalCase naming
- Import from `@/components`, `@/hooks`, `@/contexts`
- Strict TypeScript, no `any` types
- Tailwind for styling, CSS variables for theme colors

## Important Notes

- **Theme directory**: `theme/` contains HTML prototypes for reference only
- **Deployment**: GitHub Actions auto-deploys to GitHub Pages on push to `main`
- **Testing**: Unit tests for game logic, E2E tests for UI flows
- **Router**: Uses HashRouter for GitHub Pages compatibility
