---
title: Terminal Notes Workflow
date: 2026-05-21
tags: notes, portal, markdown
summary: Owltree notes now read directly from markdown files under src/content/notes.
type: article
---

# Terminal Notes Workflow

Owltree can now index markdown files from `src/content/notes/`.

## How it works

- Add a new `.md` file to the folder.
- Optionally provide frontmatter for `title`, `date`, `tags`, `summary`, and `type`.
- The notes page will pick it up automatically at build time.

## Suggested frontmatter

```md
---
title: My Note
date: 2026-05-21
tags: obsidian, publish
summary: One-line summary for the list view.
type: article
---
```

## Why this shape

This keeps the site static while making note publishing feel closer to dropping files into a terminal-managed knowledge folder.
