# Workspace Misty Cyber Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refresh the Games, Notes, Tools, and Trends pages so their internal surfaces match the lighter misty-cyber homepage instead of reverting to dark dashboard styling.

**Architecture:** Keep the existing routes and page structure intact. Update only page-level presentation classes and page-local card/button treatments so all four workspaces share the homepage’s brighter frosted surface language.

**Tech Stack:** React, TypeScript, Tailwind CSS, shared global CSS utilities.

---

### Task 1: Refresh shared page headers in workspace pages

**Files:**
- Modify: `src/pages/Games.tsx`
- Modify: `src/pages/Notes.tsx`
- Modify: `src/pages/Tools.tsx`
- Modify: `src/pages/Trends.tsx`

**Step 1: Update back buttons**

- Replace dark slate back-button surfaces with bright frosted buttons matching the homepage control style.

**Step 2: Update page headings**

- Change title and subtitle text from white/slate-on-dark to slate-on-light.
- Remove remaining purple-heavy heading accents.

### Task 2: Refresh content cards and tags

**Files:**
- Modify: `src/pages/Games.tsx`
- Modify: `src/pages/Notes.tsx`
- Modify: `src/pages/Tools.tsx`
- Modify: `src/pages/Trends.tsx`

**Step 1: Replace dark cards**

- Replace `bg-slate-900/50`, `bg-slate-900/70`, `bg-slate-800/30`, and similar classes with brighter white/frosted card surfaces.

**Step 2: Update text hierarchy**

- Switch card titles to `text-slate-900` / `text-slate-800` and descriptive copy to `text-slate-600` / `text-slate-500`.

**Step 3: Refresh badges and inline controls**

- Replace dark tags, pills, and button chips with lighter background tokens and clearer borders.

### Task 3: Remove remaining AI-template accents

**Files:**
- Modify: `src/pages/Games.tsx`
- Modify: `src/pages/Trends.tsx`

**Step 1: Remove purple/pink-heavy featured treatments**

- Replace featured-state purple/pink accents with teal/coral/amber or neutral slate accents.

**Step 2: Keep cyber identity without dark dashboard feel**

- Retain energetic accent colors, but keep the surfaces and hierarchy aligned with the homepage.

### Task 4: Verify the refresh

**Files:**
- Verify: `src/pages/Games.tsx`
- Verify: `src/pages/Notes.tsx`
- Verify: `src/pages/Tools.tsx`
- Verify: `src/pages/Trends.tsx`

**Step 1: Run diagnostics**

Run LSP diagnostics on all modified files.
Expected: No TSX/TypeScript errors.

**Step 2: Run build**

Run: `npm run build`
Expected: Exit code 0.

**Step 3: Visual review checklist**

- All four workspaces feel visually related to the homepage.
- Dark inner surfaces are gone.
- Purple/pink-heavy AI-template accents are removed.
- No route or behavior changes were introduced.
