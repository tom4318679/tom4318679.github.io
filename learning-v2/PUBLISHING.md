# Learning v2 Daily Publishing Runbook

This file defines the stable daily publishing procedure. The machine-readable source of truth is `publish-config.json`.

## Trigger

When the user says **「發布」** in the daily learning brief context, execute the publish flow directly. Do not ask which repository or which `learning-v2` path to use.

## Source of truth

Always read these live before publishing:

1. `learning-v2/publish-config.json`
2. `learning-v2/manifest.json`

Do not use remembered repository names, remembered latest dates, or old directory layouts as authoritative state.

## Fixed destination

- Repository: `tom4318679/tom4318679.github.io`
- Branch: `main`
- Project root: `learning-v2/`
- Daily data: `learning-v2/data/`
- Manifest: `learning-v2/manifest.json`
- Current entry: `/learning-v2/`
- Unified history entry: `/learning-v2/history/`

`learning-v2` is a directory, never a standalone repository.

## Daily issue contract

A normal newly published issue contains exactly:

- 5 English article JSON files
- 3 Japanese article JSON files
- 1 issue descriptor `data/YYYY-MM-DD.json`

The descriptor must reference all 8 parts and contain validation metadata.

## Stable publish sequence

1. Read `publish-config.json`.
2. Read `manifest.json` live.
3. Identify the fully prepared issue in the current daily-brief context.
4. Check whether any target files already exist.
5. Write/repair the 5 English parts.
6. Write/repair the 3 Japanese parts.
7. Write/repair the issue descriptor.
8. Read back all 8 parts and the descriptor.
9. Confirm 5 English + 3 Japanese, all validation statuses are `target`, and `minimumLineUsed=false`.
10. Only then update `manifest.json`; set `latest` to the completed issue and add the issue once.
11. Read back `manifest.json` and verify the final state.
12. Report success only after read-back verification.

## Idempotency

Publishing the same date twice must not create duplicates. If files already exist, verify them first and update only incomplete or incorrect files. `manifest.issues` must contain each issue ID only once.

## Guardrails

- Never search for a repository named `learning-v2`.
- Never create a new date folder for daily content.
- Never touch preserved legacy article pages or `data/legacy/` during a normal daily publish.
- Never move `manifest.latest` to a partially written issue.
- Never reconstruct a full prepared issue from only a summary table, titles, or remembered word counts.
- Never claim success until the final GitHub read-back confirms the issue and manifest.

## Failure behavior

If GitHub access fails, a prepared payload is missing, or validation fails, leave `manifest.latest` unchanged and report the exact blocking step. Do not improvise a different repository, directory, or content source.

## Unified history behavior

`manifest.json` serves both current and historical navigation:

- A current JSON issue has no `href`; the history UI opens `/learning-v2/?date=YYYY-MM-DD`.
- A preserved legacy issue has an explicit `href`; the history UI opens that original article page directly.
- Legacy article pages keep their historical layout/functions, but their old landing/archive hubs redirect to Learning v2.
- Historical compatibility is navigation-only and is not part of normal daily publishing.
