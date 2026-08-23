# Single-entry migration check

Learning v2 is the only learning navigation hub.

- Current/latest: `/learning-v2/`
- Unified history: `/learning-v2/history/`
- Legacy article pages remain in place only as content destinations.
- Old `learning/` and `daily-learning/` landing/archive pages redirect to Learning v2.
- Legacy history links are stored explicitly in `manifest.json` via `href`.
- Current JSON issues remain data-driven and have no `href`.

Date inventory checked on 2026-08-23:

- Legacy preserved: 2026-07-31 through 2026-08-09 where source pages exist.
- Current JSON history: 2026-08-10, then 2026-08-12 through 2026-08-23.
- No repository file or commit was found for 2026-08-11, so it is intentionally absent rather than silently fabricated.
