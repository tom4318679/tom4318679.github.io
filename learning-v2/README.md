# Learning v2 repository structure

`learning-v2` is a directory inside the repository `tom4318679/tom4318679.github.io`. It is not a standalone repository.

## Daily publishing source of truth

For every daily publish, do **not** rely on remembered chat history. Read these files live first:

1. `publish-config.json` — machine-readable repository/path/publish contract.
2. `PUBLISHING.md` — human-readable daily runbook and failure rules.
3. `manifest.json` — current live latest issue and history state.

The canonical user trigger is **「發布」**. In the daily learning brief context, this means: read the publishing contract, publish the fully prepared issue, validate it, and update the manifest last.

## Canonical structure

```text
learning-v2/
├─ index.html                 # Single reader entry point
├─ manifest.json              # Latest issue + history index
├─ publish-config.json        # Machine-readable daily publish contract
├─ PUBLISHING.md              # Stable daily publishing runbook
├─ README.md                  # Architecture note
├─ assets/
│  ├─ app.js                  # Reader + legacy migration adapter
│  ├─ history.js              # History page logic
│  └─ style.css               # Shared styles
├─ data/
│  ├─ YYYY-MM-DD.json         # Issue descriptor (canonical entry for every issue)
│  ├─ YYYY-MM-DD-en-N.json    # Current English article parts
│  ├─ YYYY-MM-DD-ja-N.json    # Current Japanese article parts
│  └─ legacy/                 # Historical raw archive only
└─ history/
   └─ index.html              # History UI; reads manifest.json
```

## Publishing contract

1. Never create or search for a repository named `learning-v2`; use `tom4318679/tom4318679.github.io`.
2. Treat `learning-v2` only as the project directory.
3. Never publish a new issue by creating a date directory.
4. Every issue must have `data/YYYY-MM-DD.json`.
5. A normal issue contains exactly 5 English + 3 Japanese part JSON files.
6. The issue descriptor must reference exactly those 8 parts and retain validation metadata.
7. Update `manifest.json` only after all issue files have been written and read-back verified.
8. `manifest.latest` must point only to a fully completed issue.
9. The public reader is `/learning-v2/?date=YYYY-MM-DD`; `/learning-v2/` opens `manifest.latest`.
10. Re-running publish for the same date must be idempotent: verify/update existing files, never duplicate the issue.

## Safe update order

```text
1. Read publish-config.json
2. Read manifest.json live
3. Write/verify 5 English part JSON files
4. Write/verify 3 Japanese part JSON files
5. Write/verify data/YYYY-MM-DD.json
6. Read back all 8 parts + descriptor and validate
7. Update manifest.json last
8. Read back manifest.json and confirm latest
```

If any write or validation step fails, `manifest.latest` must remain unchanged.

## What normal publishing should ignore

Historical standalone HTML/TXT layouts, old date-folder publishing logic, stale remembered latest dates, and the old mistaken assumption that `learning-v2` is a repository are not valid operational inputs anymore.

## Legacy migration

Issues 2026-08-06 through 2026-08-09 were originally stored as standalone HTML or split TXT/HTML pages. Their raw sources are archived under `data/legacy/` and loaded through the same reader. Old date directories are compatibility redirects only and are not content storage.
