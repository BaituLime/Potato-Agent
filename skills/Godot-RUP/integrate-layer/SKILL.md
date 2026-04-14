---
name: integrate-layer
description: Integrate one already-settled module layer into that module's integration worktree, record the real commit, and recycle freed worker slots. Use only after a layer was gated to integration.
compatibility: opencode
---

# Integrate Layer (Godot-RUP + C#)

Use this Skill to integrate one already-settled module layer into that module's integration worktree.

Canonical references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/SCHEDULER-RULES.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/RUNTIME-ARTIFACT-CONTRACT.md`

## Goal

- integrate exactly one `module_id + layer_id`

## Read boundary

Read from:

- the relevant layer settlement
- `runs/<run_id>/slot-table.json`
- `runs/<run_id>/modules/<module_id>.json`
- `runs/<run_id>/session.json`

## Write boundary

You may write only:

- the module integration worktree git state
- `runs/<run_id>/integrations/<module_id>/<layer_id>.json`
- `runs/<run_id>/slot-table.json`
- `runs/<run_id>/modules/<module_id>.json`
- `runs/<run_id>/session.json`

## Hard rules

- Integrate per module only.
- Operate on one `module_id + layer_id`.
- Merge only into `.worktrees/<module_id>/integration`.
- Record the real resulting commit hash.
- Recycle worker slots that the integrated layer no longer needs.
- Do not fake integration by editing run state alone.
- Do not perform explicit ship/mainline integration here.
- Do not set a module status to `done` here.
- Do not invent `yield_reason`, `continue_reason`, `resume_reason`, `dispatch_refresh_needed`, or a final session stop here; runner yields and final stop-policy transitions stay outside this skill.

## Consistency gate

- Reread `runs/<run_id>/integrations/<module_id>/<layer_id>.json` and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/integration-record.schema.json`.
- Confirm `runs/<run_id>/modules/<module_id>.json` records the resulting `last_integration_commit` and does not overclaim post-acceptance ship state.
- Confirm `runs/<run_id>/slot-table.json` reflects the recycled worker-slot state after integration.
