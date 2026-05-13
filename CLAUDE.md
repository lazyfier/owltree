# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Owltree — a personal portal homepage built with React 18, Vite, and TypeScript. It currently ships a terminal-first UI (`data-theme="terminal"`) and an experimental narrative game "月抛模拟器" (moon-throw simulator).

The `theme/` directory contains HTML/CSS prototypes used as visual references (not part of the build).

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + CSS Variables for theming
- **State**: React Context for fixed terminal theme + browser storage for game achievements
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
│   │   ├── portal/     # Terminal portal homepage components (TerminalHome, ProjectRow)
│   │   ├── moon-throw/ # Game UI components
│   │   ├── layout/     # Layout components (Footer)
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

## Directory Placement Rules

### Mandatory Principle

**Project-level first. Global-level only as fallback.**

When adding any new code, file, module, component, hook, style, or asset, follow this order:

1. Put it in `projects/<project-name>/`
2. Only if the project-level scope genuinely cannot support it
3. And only if the host must control it globally
4. Then promote it into `src/`

This is not optional.

### `src/` = host platform

`src/` is reserved for host-level concerns only.

Allowed in `src/`:

- home page and host pages
- router entry and route shell
- global layout
- theme system
- global context
- host-controlled infrastructure
- project registration / mounting layer

Not allowed in `src/`:

- project-private business logic
- project-private components
- project-private styles
- project-private assets
- anything added only because “it may be reused later”

### `projects/` = isolated project space

`projects/<name>/` is the default destination for new work.

Put these in `projects/<name>/`:

- project pages
- project components
- project hooks
- project logic
- project styles
- project assets
- project-local data and types
- anything intended for folder-level replacement or overwrite updates

If you are unsure, default to `projects/<name>/`.

### Hard Decision Rule

Before placing anything in `src/`, all of the following must be true:

- there is no suitable implementation inside the target project
- the problem is not project-specific
- the host must own or coordinate this capability
- keeping it project-local would create clear structural duplication or control problems

If any of these are false, keep it in the project.

### Explicit Prohibitions

#### Do not create a shared component pool by default

Do **not** move code into `src/` just because:

- two projects use similar UI
- the names look generic
- the implementation feels reusable
- you want to “clean it up early”

Similarity is not enough.

#### Do not globalize preemptively

Do **not** promote code into `src/` based on speculative future reuse.

“Might be reused later” is not a valid reason.

#### Do not couple projects together

Forbidden:

- `projects/a` importing from `projects/b`
- shared logic hidden inside one project and consumed by others
- cross-project dependency chains

Projects must remain replaceable as isolated folders.

#### Do not leak project internals into the host

The host should mount projects through a stable entry or registration layer.

The host must not depend on scattered internal files from project folders.

### Placement Checklist

#### Put in `projects/<name>/` if:

- it mainly serves one project
- it should be replaceable by overwriting that project folder
- it should not affect unrelated projects
- its meaning is project-specific
- you are not forced to centralize it

#### Put in `src/` only if:

- it belongs to the host itself
- it must be controlled globally
- project-level placement is insufficient
- the capability is platform-level, not business-level

### Enforcement Summary

When adding new code:

- **default target:** `projects/<name>/`
- **exception target:** `src/`
- **burden of proof:** on any move into `src/`

If you cannot clearly justify why something must live in `src/`, it does not belong there.

### One-line Rule

> Default to project-level. Only escalate to global-level when project-level truly fails.

## Key Patterns

### Theme System

Runtime theme behavior is terminal-only:
- `terminal` is the only active runtime theme.
- `ThemeContext` sets `data-theme="terminal"` on the root element.
- Old theme localStorage values are ignored.
- Static visual experiments live under `theme/` and are not mounted by the app.

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
