# Notes Publishing

Owltree publishes Markdown from `src/content/notes/`.

For Obsidian, keep a dedicated public folder in your vault, for example:

```text
~/notes/published/
├── terminal-notes.md
└── worklogs/
    └── weekly-sync.md
```

Then sync only that public folder into Owltree:

```bash
OWLTREE_NOTES_SOURCE_DIR=~/notes/published npm run notes:sync
```

You can also pass the source directory directly:

```bash
npm run notes:sync -- ~/notes/published
```

The sync command:

- copies `.md` files recursively into `src/content/notes/`
- skips dot-directories and `node_modules`
- does not delete existing published notes
- lets the Vite metadata plugin refresh updated timestamps on the next dev/build run

Recommended Obsidian workflow:

1. Keep private notes outside the published folder.
2. Move or copy only notes intended for GitHub Pages into the published folder.
3. Run `npm run notes:sync`.
4. Preview with `npm run dev`.
5. Commit the resulting `src/content/notes/` changes.
