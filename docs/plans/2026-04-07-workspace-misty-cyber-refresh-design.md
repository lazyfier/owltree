# Workspace Misty Cyber Refresh Design

## Goal
Align the four workspace pages — Games, Notes, Tools, and Trends — with the lighter misty-cyber homepage so the experience feels consistent and no longer drops back into dark AI-style card layouts.

## Decision
Use direct visual alignment now instead of adding a brightness or light/dark selector.

## Why
- The current problem is inconsistency, not lack of user theme control.
- A selector would add state, styling branches, and more maintenance before the new visual language is stable.
- The homepage already defines the intended direction: brighter frosted surfaces, softer shadows, stronger editorial hierarchy, and reduced purple/pink template gradients.

## Scope
- Refresh `src/pages/Games.tsx`
- Refresh `src/pages/Notes.tsx`
- Refresh `src/pages/Tools.tsx`
- Refresh `src/pages/Trends.tsx`
- Reuse existing shared homepage tone from `src/styles/globals.css` and `src/components/layout/Footer.tsx`

## Visual Rules
- Replace dark inner surfaces (`bg-slate-900/50`, `bg-slate-800`, `text-white`) with brighter frosted surfaces and slate text.
- Keep teal/coral/amber as the main accents.
- Remove remaining purple/pink-heavy treatments, especially in Games and Trends.
- Preserve the cyber personality, but make the pages feel curated and readable rather than dashboard-like.
- Keep structure and routing unchanged.

## Expected Result
The four workspace pages should feel like part of the same product as the homepage: light mist background, brighter cards, calmer controls, and consistent typography/spacing.
