---
name: cleanup-run-worktrees
description: Remove run-scoped worker worktrees when a runner-owned cleanup decision says a stopped execution run should be torn down now, and record the cleanup state.
compatibility: opencode
---

Use only these references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/TERMS.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/RUNNER-RULES.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/RUNTIME-ARTIFACT-CONTRACT.md`

Goal:

- remove the current run's worker worktrees when the runner decided this stopped run should be cleaned now
- record cleanup state without overstating acceptance, shipping, or replanning authority

Read only:

- `runs/<run_id>/session.json`
- `runs/<run_id>/slot-table.json`

Write only:

- repo-local worktree topology for `.worktrees/runs/<run_id>/worker-*`
- `runs/<run_id>/slot-table.json`
- `runs/<run_id>/session.json`

Hard rules:

- operate on one stopped run session at a time
- require `runs/<run_id>/session.json.current_phase = stopped`
- require `runs/<run_id>/session.json.stop_reason` to be a real execution-stage stop such as `manual_needed`, `replan_needed`, `ready_for_acceptance`, or `global_blocked`
- immediate cleanup is the normal path for smooth completion stops such as `ready_for_acceptance`
- for `manual_needed`, `replan_needed`, or `global_blocked`, cleanup is deferred by default; do not run this skill reflexively at first stop surfacing unless the runner has already decided that stopped run should now be retired
- remove only worker worktrees rooted under `.worktrees/runs/<run_id>/`
- do not touch `.worktrees/<module_id>/integration` or `.worktrees/<module_id>/acceptance`
- if a listed worker path is already absent, record that truth cleanly instead of failing just to preserve stale directories
- after removal, mark affected worker slots as `cleaned` and clear `assigned_module_id`, `assigned_scope_id`, and `branch`
- append concise cleanup notes to `runs/<run_id>/session.json`
- do not change the session stop reason, stop scope, or acceptance/ship state here

Consistency gate:

- reread `runs/<run_id>/slot-table.json` and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/slot-table.schema.json`
- reread `runs/<run_id>/session.json` and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/session.schema.json`
- confirm the removed worker worktree paths are actually absent from the repo-local worktree topology before reporting success

Output:

- report which run-scoped worker worktrees were removed
- report any already-absent worker paths as historical cleanup, not as fresh failure
