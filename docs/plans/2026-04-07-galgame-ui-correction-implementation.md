# Galgame UI Correction Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Correct the portal redesign so anime / 二次元 identity is expressed through actual galgame UI language rather than color substitution.

**Architecture:** Keep the current site structure and content exactly as-is. Rebuild the visual grammar through shared panel tokens, section framing, menu labels, title bars, and route/save-slot inspired list styling across the homepage and workspace pages.

**Tech Stack:** React, TypeScript, Tailwind CSS, shared global CSS utilities, Framer Motion.

---

### Task 1: Rework shared visual grammar in global styles

**Files:**
- Modify: `src/styles/globals.css`

**Step 1: Add galgame panel language**
- Add or revise shared styles so panels feel like framed dialog/menu windows instead of generic frosted cards.

**Step 2: Add menu-control language**
- Update button and badge helpers to resemble system menu buttons, route tags, and state labels.

**Step 3: Keep palette supportive, not dominant**
- Preserve the softer palette, but make structure do the thematic work.

### Task 2: Correct homepage to feel like a true main menu

**Files:**
- Modify: `src/components/portal/Hero.tsx`
- Modify: `src/components/portal/CategoryGrid.tsx`
- Modify: `src/components/portal/DailyTrendsPreview.tsx`
- Modify: `src/pages/Home.tsx`

**Step 1: Hero**
- Make the hero feel like a title screen / main menu header.

**Step 2: Category cards**
- Make category entries resemble route-selection panels instead of standard cards.

**Step 3: Trends preview**
- Restyle as an information panel / in-world log instead of a widget card.

### Task 3: Correct workspace pages into menu/list archetypes

**Files:**
- Modify: `src/pages/Games.tsx`
- Modify: `src/pages/Notes.tsx`
- Modify: `src/pages/Tools.tsx`
- Modify: `src/pages/Trends.tsx`

**Step 1: Header framing**
- Each page should use a header that reads like chapter/menu UI.

**Step 2: Content framing**
- Games should feel like route/chapter panels.
- Notes should feel like scenario logs or archive slots.
- Tools should feel like config/system menu entries.
- Trends should feel like terminal/intel panels.

**Step 3: Metadata and controls**
- Tags, chips, pills, and action buttons should all use route/system label language.

### Task 4: Align footer and final cohesion

**Files:**
- Modify: `src/components/layout/Footer.tsx`

**Step 1: Make footer part of the interface**
- Restyle the footer so it reads like the bottom system bar of the same UI family.

### Task 5: Verify the correction

**Files:**
- Verify all modified files above

**Step 1: Run diagnostics**
Run LSP diagnostics on every modified file.
Expected: No TSX/TypeScript errors.

**Step 2: Run build**
Run: `npm run build`
Expected: Exit code 0.

**Step 3: Visual review checklist**
- The site now reads as anime-themed through UI grammar, not just color
- Cards are no longer generic frosted rectangles
- No new sections or content were added
- Functionality and routes remain unchanged
