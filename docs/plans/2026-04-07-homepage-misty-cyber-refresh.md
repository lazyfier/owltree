# Homepage Misty Cyber Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refresh the Owltree homepage portal so it feels lighter, more intentional, and less like a generic AI-generated dark dashboard while preserving the owl, pixel, and cyber identity.

**Architecture:** Keep the existing homepage structure and route model, but update the shared visual system and homepage-facing portal components. The work should concentrate on softer global surfaces, more breathable composition, and clearer hierarchy rather than introducing new product scope.

**Tech Stack:** React, TypeScript, Tailwind CSS, Framer Motion, shared global CSS utilities.

---

### Task 1: Lighten the shared homepage visual system

**Files:**
- Modify: `src/styles/globals.css`

**Step 1: Update base color tokens**

- Shift the page base from near-black into misty blue-slate tones.
- Keep teal/coral/amber identity, but reduce heavy darkness and remove visual dependence on black surfaces.

**Step 2: Soften page background composition**

- Replace the current heavy layered dark background with a lighter, airier mist background.
- Preserve subtle atmosphere, but avoid “dark neon dashboard” energy.

**Step 3: Redefine surface classes**

- Adjust `.glass-card`, `.glass-button`, `.pixel-card`, and `.pixel-divider` so surfaces read brighter, quieter, and more tactile.
- Reduce heavy blur/shadow values and increase border clarity.

**Step 4: Verify styling remains coherent**

Run: `npm run build`
Expected: Build succeeds and updated shared styles compile into production output.

### Task 2: Refine homepage hero hierarchy

**Files:**
- Modify: `src/components/portal/Hero.tsx`

**Step 1: Keep the owl + title identity**

- Preserve the owl beside the title.
- Keep pixel/cyber personality, but reduce excessive glow intensity.

**Step 2: Improve readability and personality**

- Introduce a more editorial hierarchy: stronger eyebrow/subtitle treatment, softer title glow, and a more deliberate spacing rhythm.

**Step 3: Verify motion remains subtle**

- Keep the existing entrance animation, but ensure the final design feels polished instead of flashy.

### Task 3: Replace generic homepage card styling

**Files:**
- Modify: `src/components/portal/CategoryGrid.tsx`
- Modify: `src/components/portal/DailyTrendsPreview.tsx`
- Modify: `src/pages/Home.tsx`
- Modify: `src/components/layout/Footer.tsx` (if needed for consistency)

**Step 1: Rework category cards**

- Remove generic purple/pink AI-style gradients.
- Use lighter surfaces, more intentional spacing, cleaner badges, and stronger text hierarchy.

**Step 2: Rework trends preview panel**

- Match the new surface language with lighter card treatment and calmer controls.
- Keep the content density, but make it feel curated instead of like a system widget.

**Step 3: Improve homepage composition**

- Add breathing room and clearer sectional rhythm in `Home.tsx`.
- Make the page feel like a personal portal, not a grid of interchangeable SaaS cards.

**Step 4: Align footer styling**

- If footer contrast or borders still feel too dark, lighten them to match the new homepage surface system.

### Task 4: Verify and polish

**Files:**
- Verify: `src/styles/globals.css`
- Verify: `src/components/portal/Hero.tsx`
- Verify: `src/components/portal/CategoryGrid.tsx`
- Verify: `src/components/portal/DailyTrendsPreview.tsx`
- Verify: `src/pages/Home.tsx`
- Verify: `src/components/layout/Footer.tsx`

**Step 1: Run diagnostics**

Run: LSP diagnostics on all modified files
Expected: No TypeScript/TSX errors.

**Step 2: Run production build**

Run: `npm run build`
Expected: Exit code 0.

**Step 3: Visual review checklist**

- Homepage reads noticeably lighter.
- Owl/title identity remains intact.
- Purple/pink generic gradients are removed from homepage portal UI.
- Cards feel less like AI-template glass cards and more like deliberate personal portal surfaces.
