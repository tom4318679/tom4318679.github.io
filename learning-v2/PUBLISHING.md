# Learning v2 Daily Publishing Runbook

This file defines the stable daily publishing procedure. The machine-readable source of truth is `publish-config.json`.

## Trigger

When the user says **「發布」** (or equivalent explicit approval) in the daily learning brief context, execute the publish flow directly. Do not ask which repository, branch, or `learning-v2` path to use.

## Fixed destination

- Repository: `tom4318679/tom4318679.github.io`
- Branch: `main`
- Project root: `learning-v2/`
- Daily data: `learning-v2/data/`
- Manifest: `learning-v2/manifest.json`
- Current entry: `/learning-v2/`
- Unified history entry: `/learning-v2/history/`

`learning-v2` is a directory, never a standalone repository. Never search for a repository named `learning-v2`.

## Scheduled preparation model

The daily scheduled task is **planning-only preparation**.

It should:

1. Read `learning-v2/publish-config.json` directly from the fixed repository.
2. Read `learning-v2/manifest.json` directly from the fixed repository.
3. Confirm the current formal `manifest.latest` and the next issue date.
4. Prepare the 5 English + 3 Japanese topics, levels, angles, and one-line takeaways.
5. Report that the issue is ready for interactive generation.

It should **not** generate the full long-form issue, persist a full payload, modify GitHub, or invent word/character counts before full generation.

## Interactive publishing model

After the user explicitly says 「發布」:

1. Read `publish-config.json` live from the fixed repository.
2. Read `manifest.json` live from the fixed repository.
3. Generate the full 5 English + 3 Japanese issue in that same interactive turn using the prepared topics and the live contracts.
4. Count and validate every core article body; expand any article that is below target before writing.
5. Check whether target files already exist and use idempotent repair when needed.
6. Write/repair the 5 English part JSON files.
7. Write/repair the 3 Japanese part JSON files.
8. Write/repair the issue descriptor `learning-v2/data/YYYY-MM-DD.json` referencing exactly 8 parts with validation metadata.
9. Read back all 8 parts and the descriptor.
10. Confirm English=5, Japanese=3, every validation status=`target`, and `minimumLineUsed=false`.
11. Only then update `learning-v2/manifest.json`; set `latest` to the completed dated issue and add the issue once.
12. Read back `manifest.json` and verify the final state before reporting success.

A previously persisted full article payload is **not** a prerequisite. The intended workflow is to generate full content interactively after the explicit publish trigger.

## Daily issue contract

A normal newly published issue contains exactly:

- 5 English article JSON files
- 3 Japanese article JSON files
- 1 issue descriptor `data/YYYY-MM-DD.json`

The descriptor must reference all 8 parts and contain validation metadata.

## Japanese v2 learning contract

Japanese is optimized for advanced practical Japanese: background knowledge, naturalness, nuance, and professional usage.

For each Japanese article follow the live `publish-config.json` contract, especially:

- Core article target: about **1,000–1,200 Japanese characters**.
- 繁中精準解說
- 高階用語
- 固定搭配與不自然用法
- 長句拆解
- ビジネス・実務表現
- **関連知識・背景理解**
- **自然な言い換え・ニュアンス**

Do not generate the removed low-value modules:

- 要約訓練
- 会話と雑談
- 理解と口頭表現

## Preview issues

Preview files may appear in unified history with `kind: "preview"`.

- A preview is for layout/content experiments only.
- `manifest.latest` must never point to a preview.
- A preview does not satisfy or replace the next dated daily issue.
- Normal daily publishing preserves preview entries unless the user explicitly asks to remove them.

## Idempotency

Publishing the same date twice must not create duplicates. If files already exist, verify them first and update only incomplete or incorrect files. `manifest.issues` must contain each issue ID only once.

## Guardrails

- Never search for a repository named `learning-v2`.
- Never treat `learning-v2` as a standalone repository.
- Never ask the user to reconfirm the fixed repository, branch, or project path.
- Never require a saved full payload for the planning-only scheduled workflow.
- Never create a new date folder for daily content.
- Never touch preserved legacy article pages or `data/legacy/` during a normal daily publish.
- Never move `manifest.latest` to a partially written issue or a preview.
- Never claim success until final GitHub read-back confirms the issue and manifest.

## Failure behavior

If direct access to the fixed repository's config/manifest fails, a GitHub write/read-back fails, or validation fails, leave `manifest.latest` unchanged and report the exact blocking step. Resume partial issues idempotently rather than creating a second copy.
