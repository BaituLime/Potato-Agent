---
name: cleanup-worktrees
description: Remove shipped module worktrees and record the cleanup state after explicit shipping.
compatibility: opencode
---

Use only these references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/TERMS.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/RUN-SESSION-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-SKILL-SPEC.md`

Goal:

- remove repo-local worktrees that are no longer needed after successful shipping of one Module
- record the concrete cleanup state without overstating shipping or acceptance authority

Read only:

- `runs/<run_id>/session.json`
- `runs/<run_id>/modules/<module_id>.json`
- `runs/<run_id>/slot-table.json`

Write only:

- repo-local worktree topology
- `runs/<run_id>/slot-table.json`
- `runs/<run_id>/session.json`
- `runs/<run_id>/modules/<module_id>.json`

Hard rules:

- operate on one already-shipped Module at a time
- require `runs/<run_id>/modules/<module_id>.json.status = done` before deleting any integration worktree
- remove `.worktrees/<module_id>/integration` after successful ship when it exists
- remove lingering `.worktrees/<module_id>/acceptance` only if it still exists; that checkout is disposable and must not survive just because shipping happened later
- do not touch unrelated module worktrees or any global worker-slot worktree under `.worktrees/runs/<run_id>/`
- execution-stage worker cleanup belongs to `cleanup-run-worktrees`, not this ship cleanup skill
- do not edit project files beyond direct git worktree cleanup and runtime-state writes
- do not claim shipping success here; shipping authority remains with `integrate-main`
- if a listed worktree path is already absent, record that truth cleanly instead of failing just to preserve a stale directory
- mark the affected integration slot as `cleaned` in `runs/<run_id>/slot-table.json` after its checkout is removed
- append concise cleanup notes to `runs/<run_id>/modules/<module_id>.json` and `runs/<run_id>/session.json`

Consistency gate:

- reread `runs/<run_id>/slot-table.json` and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/slot-table.schema.json`
- reread `runs/<run_id>/modules/<module_id>.json` and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/module-session.schema.json`
- confirm the removed worktree paths are actually gone from the repo-local worktree topology before reporting success

Output:

- report which worktree paths were removed for the shipped Module
- report any already-absent cleanup paths as historical cleanup, not as fresh failure
