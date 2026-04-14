---
name: allocate-worktrees
description: Create and assign repo-local integration and global worker worktrees for one run session. Use after the dispatch weave and slot demand are known.
compatibility: opencode
---

# Allocate Worktrees (Godot-RUP + C#)

Use this Skill to create the repo-local integration worktrees and global worker worktrees for one run session.

Canonical references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/RUNNER-RULES.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/RUNTIME-ARTIFACT-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/PLANNING-ARTIFACT-CONTRACT.md`

## Goal

- materialize integration and worker slots
- write `runs/<run_id>/slot-table.json`
- seed `runs/<run_id>/modules/<module_id>.json`

## Read boundary

Read from:

- `context/context.json`
- approved `decision/<module_id>.json`
- approved `graph/<module_id>.json`
- `runs/<run_id>/session.json`
- `runs/<run_id>/dispatch-weave.json`
- `runs/<run_id>/slot-demand.json`
- when `session.previous_run_id` is non-null and `session.resume_reason = resume_after_delta`, the truthful predecessor `runs/<previous_run_id>/modules/<module_id>.json`

## Write boundary

You may write only:

- repo-local worktree topology
- `runs/<run_id>/slot-table.json`
- `runs/<run_id>/modules/<module_id>.json`
- `runs/<run_id>/session.json`

## Hard rules

- Create one integration worktree per active module at `.worktrees/<module_id>/integration`.
- Create worker slots as global reusable run-session slots at `.worktrees/runs/<run_id>/worker-XX`.
- When resuming a stopped run whose worker slots were intentionally preserved because blocked-stop cleanup was deferred, refresh and reuse those existing worker checkouts in place instead of treating them as corruption.
- When resuming a stopped run whose worker slots were previously cleaned, recreate any missing `.worktrees/runs/<run_id>/worker-XX` checkout at its canonical path instead of treating that cleanup as corruption.
- Each module integration worktree starts from that module's integration branch; if that branch does not exist yet, create it from the approved project base branch discovered from active planning or context truth.
- If active planning or context truth does not expose the base branch name, fail closed instead of hardcoding a branch name.
- Before dispatching a scope, the assigned worker slot must be refreshable from the current tip of that scope's module integration branch.
- Create or refresh worktrees with direct git commands only.
- If you touch `runs/<run_id>/session.json` here, preserve its truthful `current_phase`, `yield_reason`, `continue_reason`, `resume_reason`, and `stop_reason`; do not fabricate a runner yield, continuation reason, or user-facing stop.
- When seeding `runs/<run_id>/modules/<module_id>.json` for a lineage-root run or a non-delta fresh run, initialize same-route delta tracking fields conservatively: `delta_attempt_count = 0`, `last_delta_result_class = null`, `last_delta_trigger_summary = null`, graph/blueprint delta revision refs = null, and `delta_history_refs = []`.
- When seeding `runs/<run_id>/modules/<module_id>.json` for `session.resume_reason = resume_after_delta`, copy the truthful same-route delta bookkeeping from the predecessor module session instead of resetting it.
- When seeding `runs/<run_id>/modules/<module_id>.json`, initialize `recent_execution_learnings = []` unless truthful existing resumed state already exists.
- When seeding `runs/<run_id>/modules/<module_id>.json`, use the current active format id `godot_module_session/v3`.
- Do not allocate or track acceptance checkouts here.
- Do not dispatch subagents.
- Do not edit project files beyond git worktree management and runtime-state writes.

## Consistency gate

- Reread `runs/<run_id>/slot-table.json` and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/slot-table.schema.json`.
- Reread each written `runs/<run_id>/modules/<module_id>.json` and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/module-session.schema.json`.
- Confirm the written slot table contains only integration and worker slots, never shared acceptance slots.
- Confirm cleaned worker slots are reprovisioned back to usable runtime state when this run is resumed.
- Confirm every seeded module session points at the real integration checkout and integration branch for that module.
