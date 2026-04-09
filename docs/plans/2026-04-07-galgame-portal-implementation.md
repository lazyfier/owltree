# Galgame Portal Visual Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restyle the existing Owltree portal and workspace pages into a polished galgame / visual novel menu-inspired interface without adding new modules or changing product scope.

**Architecture:** Keep the current route and content structure unchanged. Apply the new identity through shared color tokens, panel styling, heading treatment, badge/button language, and page-level composition so the whole site feels like one coherent visual novel menu system.

**Tech Stack:** React, TypeScript, Tailwind CSS, shared global CSS utilities, Framer Motion.

---

### Task 1: Update global visual tokens for the galgame direction

**Files:**
- Modify: `src/styles/globals.css`

**Step 1: Retune color tokens**
- Shift the current misty-cyber palette toward cream, sakura pink, lilac, silver-gray, and soft cyan highlights.

**Step 2: Refresh shared surface styles**
- Update shared glass/pixel/button helpers so cards and controls feel like AVG UI panels instead of generic frosted dashboard cards.

**Step 3: Keep motion subtle**
- Preserve elegance and menu-selection feel; avoid loud animation or clutter.

### Task 2: Restyle the homepage hero and main portal entry cards

**Files:**
- Modify: `src/components/portal/Hero.tsx`
- Modify: `src/components/portal/CategoryGrid.tsx`
- Modify: `src/components/portal/DailyTrendsPreview.tsx`
- Modify: `src/pages/Home.tsx`

**Step 1: Hero**
- Make the title feel more like a route-select / main-menu title.
- Keep the owl, but integrate it into the more romantic galgame UI language.

**Step 2: Category cards**
- Restyle cards to feel like route selection panels or save/load slots.
- Replace current generic portal-card look with more characterful framing, border layering, and badge language.

**Step 3: Trends panel**
- Make the trends preview feel like an in-game information panel rather than a productivity widget.

### Task 3: Restyle the four workspace pages into galgame-style menu pages

**Files:**
- Modify: `src/pages/Games.tsx`
- Modify: `src/pages/Notes.tsx`
- Modify: `src/pages/Tools.tsx`
- Modify: `src/pages/Trends.tsx`

**Step 1: Page headers**
- Restyle each page header so it resembles a chapter/menu header rather than a default app page heading.

**Step 2: Cards and list items**
- Make list cards feel like scenario choices, route panels, or profile windows.
- Preserve existing data and modules; styling only.

**Step 3: Buttons, pills, and metadata**
- Give tags, pills, and category controls a route-tag / system-label feel.

### Task 4: Align footer and finish page cohesion

**Files:**
- Modify: `src/components/layout/Footer.tsx`

**Step 1: Footer polish**
- Align footer with the galgame UI framing so it no longer feels detached from the rest of the site.

### Task 5: Verify the visual refresh

**Files:**
- Verify all modified files above

**Step 1: Run diagnostics**
Run LSP diagnostics on all modified files.
Expected: No TSX or TypeScript errors.

**Step 2: Run build**
Run: `npm run build`
Expected: Exit code 0.

**Step 3: Visual review checklist**
- The site feels like a refined galgame / AVG menu, not a SaaS template.
- No new sections or widgets were introduced.
- The style is more anime-coded through framing, typography, and color only.
- Readability remains strong on every page.
