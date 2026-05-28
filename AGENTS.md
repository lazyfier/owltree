# AGENTS.md — Owltree

Guidelines for AI agents working in this repository.

## Project Overview

Owltree is a personal portal homepage built with React, Vite, and TypeScript. It currently ships a terminal-first UI (`data-theme="terminal"`). The `theme/` directory contains HTML/CSS prototypes for visual reference only.

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
- **Components**: One component per file, PascalCase naming (`TerminalHome.tsx`)
- **Hooks**: Custom hooks in `src/hooks/`, camelCase with `use` prefix
- **Imports**: Use path aliases (`@/components`, `@/hooks`, `@/contexts`)

### File Organization

```
owltree/
├── src/
│   ├── components/     # React components
│   │   ├── portal/     # Terminal portal homepage components (TerminalHome, ProjectRow)
│   │   ├── layout/     # Layout components (Footer)
│   │   └── ui/         # Base UI components (Button, Card, Badge)
│   ├── contexts/       # React Context (ThemeContext)
│   ├── pages/          # Page components (Home, Notes, NoteDetail, Projects)
│   ├── hooks/          # Custom React hooks
│   ├── content/        # Markdown content sources
│   │   └── notes/      # Recursively indexed note files
│   ├── styles/         # Global CSS + page-specific styles
│   │   └── pages/      # Per-page CSS
│   └── lib/            # Utility functions
├── theme/              # HTML prototypes (reference only)
│   └── themes/         # Theme prototypes
├── e2e/                # Playwright E2E tests
├── dist/               # Build output (generated, ignored)
├── docs/               # Design documentation
├── archive/            # Archived/legacy files
├── .sisyphus/          # AI planning files and evidence
└── .worktrees/         # Local auxiliary git worktrees (ignored by tooling)
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

### CSS/Styling

- **Primary**: Tailwind CSS utility classes
- **Custom**: CSS variables for the terminal theme (defined in `globals.css`)
- **Theme**: Runtime is fixed to `data-theme="terminal"` by `ThemeContext`
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

Runtime theme behavior is intentionally terminal-only:

| Theme | Description |
|-------|-------------|
| `terminal` | Default and only active runtime theme. CRT scanlines, neon cursor, command-line aesthetic |

Theme behavior:
- Uses CSS custom properties (variables)
- `data-theme="terminal"` attribute on root element
- Does not persist or restore theme selections from localStorage
- Visual experiments live in `theme/` as static prototypes

### Common Components

- **ParticleBackground**: Animated particle effect background
- **ShortcutHelp**: Global keyboard shortcut help overlay

---

## Testing

- **Unit**: Vitest for utilities and app flows (`npm run test:unit`)
- **E2E**: Playwright for UI flows (`npm run test:e2e`)
- **Coverage**: Unit tests cover UI helpers and app routing

---

## Theme Directory

`theme/` contains HTML/CSS prototypes used as visual references:

- Not part of the build
- Reference implementations for UI design

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

The terminal theme uses **focused terminal-style layouts** per page:

| Page | Terminal Layout | Command Style |
|------|----------------|---------------|
| Home | `./list_modules.sh` / `./show_projects.sh` | Notes/projects entry points and configured project rows |
| Notes | `ls -la` file listing | Permissions, dates, type icons, tags |
| Note detail | `cat` document view | Markdown rendered inside a terminal reading surface |
| Projects | `ls -la ~/projects/frontend/` | Name, updated time, status, stack, link, tags |

### Notes Content Rules

- Put published markdown notes under `src/content/notes/`
- Recursive subfolders are supported and shown in the notes browser
- Supported frontmatter keys: `title`, `date`, `type`, `tags`, `summary`, `readTime`
- Supported note types: `article`, `log`, `thought`, `dailywork`
- `tags` may be a comma-separated line or a YAML list

### Project Visibility Rules

- Project presence in the UI is controlled by `VITE_PROJECT_VISIBLE_*`, derived from the project `id`
- Project click behavior is controlled separately by `VITE_PROJECT_LINK_*`, derived from the project `id`
- A hidden project should not render at all
- A visible project with an empty link should render but stay non-clickable
- Example: `id: "owltree-portal"` maps to `VITE_PROJECT_VISIBLE_OWLTREE_PORTAL` and `VITE_PROJECT_LINK_OWLTREE_PORTAL`

### Content Metadata Rules

- `src/data/contentMetadata.generated.ts` is generated by the Vite plugin during `npm run dev` and `npm run build`
- Do not manually maintain note or project updated timestamps in application code
- Notes use local markdown file mtime; projects use the configured local project source paths in `vite.notesPlugin.ts`

### Keyboard Shortcuts

- `n` opens notes
- `p` opens projects
- `Esc` navigates to the parent path, equivalent to `..`
- `?` opens the shortcut help dialog

---

## Anti-Patterns to Avoid

1. **Don't import from barrel files** — Import directly from source
2. **Don't use `any`** — Strict typing required
3. **Don't mix theme logic** — Keep theme-specific styles in CSS variables
4. **Don't reintroduce placeholder app modules** — Keep runtime navigation focused on notes and projects unless a real module is added

---

## Deployment

GitHub Actions auto-deploys to GitHub Pages on push to `main`.

---

*Last updated: repository cleanup and terminal-only maintenance alignment*
