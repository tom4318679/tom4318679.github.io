# Learning v2 repository structure

`learning-v2` is a directory inside the repository `tom4318679/tom4318679.github.io`. It is not a standalone repository.

## Canonical structure

```text
learning-v2/
├─ index.html                 # Single reader entry point
├─ manifest.json              # Latest issue + history index
├─ README.md                  # This architecture note
├─ assets/
│  ├─ app.js                  # Reader + legacy migration adapter
│  ├─ history.js              # History page logic
│  └─ style.css               # Shared styles
├─ data/
│  ├─ YYYY-MM-DD.json         # Issue descriptor (canonical entry for every issue)
│  ├─ YYYY-MM-DD-en-N.json    # Current English article parts
│  ├─ YYYY-MM-DD-ja-N.json    # Current Japanese article parts
│  └─ legacy/                 # Raw source archive for pre-JSON issues only
└─ history/
   └─ index.html              # History UI; reads manifest.json
```

## Publishing contract

1. Never create a new repository named `learning-v2`.
2. Never publish a new issue by creating a date directory.
3. Every issue must have `data/YYYY-MM-DD.json`.
4. Current issues should use article part JSON files and list them in `parts`.
5. Update `manifest.json` only after all issue files have been written and validated.
6. `manifest.latest` must point to the newest completed issue.
7. The public reader is always `/learning-v2/?date=YYYY-MM-DD`; `/learning-v2/` opens `manifest.latest`.

## Legacy migration

Issues 2026-08-06 through 2026-08-09 were originally stored as standalone HTML or split TXT/HTML pages. Their raw sources are now archived under `data/legacy/` and loaded through the same `app.js` reader. Their public history links use the same `?date=` route as current issues.

Old date directories are compatibility redirects only. They are not content storage and must not be used for future publishing.

## Safe update order

```text
1. Write 5 English part JSON files
2. Write 3 Japanese part JSON files
3. Write data/YYYY-MM-DD.json
4. Verify all 8 parts and validation counts
5. Update manifest.json
```

This order prevents `manifest.latest` from pointing to a partially published issue.
