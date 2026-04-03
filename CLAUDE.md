# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Owltree — currently an early-stage project. The repo contains an HTML prototype in `other/moon-throw.html` (月抛模拟器, a moon-throw simulator) built with Tailwind CSS via CDN, featuring glassmorphism UI, canvas-based physics, and Chinese-language interface. `index.html` at the root is placeholder.

## Tech Stack

- Pure HTML/CSS/JavaScript — no build system, no package manager
- Tailwind CSS loaded via CDN (`cdn.tailwindcss.com`)
- Google Fonts (Noto Sans SC) for Chinese typography
- Canvas API for physics simulation rendering

## Development

No build step required. Open HTML files directly in a browser or serve with any static file server:

```bash
# Quick local server
python3 -m http.server 8080
```

## Repository Structure

- `index.html` — root placeholder (currently empty)
- `other/` — prototypes and experiments
- `README.md` — minimal project description
