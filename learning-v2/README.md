# Learning v2 repository structure

`learning-v2` is a directory inside the repository `tom4318679/tom4318679.github.io`. It is not a standalone repository.

## Daily publishing source of truth

For every daily publish, do **not** rely on remembered chat history. Read these files live first:

1. `publish-config.json` — machine-readable repository/path/publish contract.
2. `PUBLISHING.md` — human-readable daily runbook and failure rules.
3. `manifest.json` — current live latest issue and unified history index.

The canonical user trigger is **「發布」**. In the daily learning brief context, this means: read the publishing contract, publish the fully prepared issue, validate it, and update the manifest last.

## Single-entry architecture

Public learning navigation is intentionally centralized:

- `/learning-v2/` — single current/latest entry.
- `/learning-v2/history/` — single history entry for every available issue.

The older `/learning/` and `/daily-learning/` landing/archive pages are deprecated and redirect to these Learning v2 entries.

Historical article pages themselves are preserved because they contain their original layout and interaction behavior. `manifest.json` may therefore use an explicit `href` for a legacy issue. Current JSON issues omit `href` and use `/learning-v2/?date=YYYY-MM-DD`.

## Canonical structure

```text
learning-v2/
├─ index.html                 # Single current reader entry
├─ manifest.json              # Latest issue + unified history index
├─ publish-config.json        # Machine-readable daily publish contract
├─ PUBLISHING.md              # Stable daily publishing runbook
├─ README.md                  # Architecture note
├─ assets/
│  ├─ app.js                  # Current JSON reader only
│  ├─ history.js              # Unified history page logic
│  └─ style.css               # Shared styles
├─ data/
│  ├─ YYYY-MM-DD.json         # Current issue descriptor
│  ├─ YYYY-MM-DD-en-N.json    # Current English article parts
│  ├─ YYYY-MM-DD-ja-N.json    # Current Japanese article parts
│  └─ legacy/                 # Inactive archival copies; not used by normal navigation
└─ history/
   └─ index.html              # The only history UI; reads manifest.json
```

## Publishing contract for new/current issues

1. Never create or search for a repository named `learning-v2`; use `tom4318679/tom4318679.github.io`.
2. Treat `learning-v2` only as the project directory.
3. Never publish a new issue by creating a date directory.
4. Every newly published issue must have `data/YYYY-MM-DD.json`.
5. A normal new issue contains exactly 5 English + 3 Japanese part JSON files.
6. The issue descriptor must reference exactly those 8 parts and retain validation metadata.
7. Update `manifest.json` only after all issue files have been written and read-back verified.
8. `manifest.latest` must point only to a fully completed current issue.
9. The current reader is `/learning-v2/?date=YYYY-MM-DD`; `/learning-v2/` opens `manifest.latest`.
10. Re-running publish for the same date must be idempotent: verify/update existing files, never duplicate the issue.
11. Do not modify legacy article pages during a normal daily publish.

## Unified history rules

- Current JSON issues: manifest entry without `href` → history opens `/learning-v2/?date=YYYY-MM-DD`.
- Legacy issues: manifest entry with `href` → history opens the preserved original page directly.
- Legacy article pages are content destinations, not navigation hubs.
- Old landing pages and old archive pages must redirect to Learning v2.

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

Historical standalone HTML/TXT layouts, inactive `data/legacy` copies, old date-folder publishing logic, stale remembered latest dates, and the old mistaken assumption that `learning-v2` is a repository are not valid operational inputs for a normal daily publish.
