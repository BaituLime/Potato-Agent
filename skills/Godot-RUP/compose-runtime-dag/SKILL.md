---
name: compose-runtime-dag
description: Build one run-session combined runtime DAG, dispatch weave, slot demand, and layer todo list from multiple approved module graphs. Use when execution is starting or the admitted weave must be recomputed from planning truth.
compatibility: opencode
---

# Compose Runtime DAG (Godot-RUP + C#)

Use this Skill to compose one run-session combined runtime DAG, dispatch weave, slot demand, and runtime todo list from approved module graphs.

Canonical references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/RUNNER-RULES.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/RUNTIME-ARTIFACT-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/PLANNING-ARTIFACT-CONTRACT.md`

## Goal

- write `runs/<run_id>/session.json`
- write `runs/<run_id>/combined-dag.json`
- write `runs/<run_id>/dispatch-weave.json`
- write `runs/<run_id>/slot-demand.json`
- write `runs/<run_id>/todo.json`

## Read boundary

Read from:

- approved `decision/<module_id>.json`
- approved `graph/<module_id>.json`
- existing run-session files when resuming and only when their pinned module `graph_revision_id` values still match the active approved graphs

Treat any active `graph/<module_id>.json.repair_policy` as runtime-relevant planning truth for later runner-owned stop handling. Do not infer repair automation from chat memory alone.

## Write boundary

You may write only:

- `runs/<run_id>/session.json`
- `runs/<run_id>/combined-dag.json`
- `runs/<run_id>/dispatch-weave.json`
- `runs/<run_id>/slot-demand.json`
- `runs/<run_id>/todo.json`

## Hard rules

- Always compose across the requested modules, not one module at a time.
- Reread the canonical common runtime docs before inheriting behavior from any older run subtree or stale runtime artifact.
- If any requested module's active `graph_revision_id` differs from the candidate run's pinned module revision, do not reuse that run; require a fresh `run_id` instead.
- If the candidate run's existing `session.json` still uses an older session machine shape, do not mutate it in place; require a fresh `run_id` instead.
- Do not merge a newer graph revision into an older run subtree or carry old `session.json`, `combined-dag.json`, `dispatch-weave.json`, `attempts/`, or `settlements/` forward as if they belonged to the new revision.
- For a lineage-root run, write `lineage_run_id = run_id` and `previous_run_id = null`.
- For a fresh successor run created after lawful same-route delegated delta planning, preserve the predecessor lineage id, set `previous_run_id` to the stopped predecessor run id, and keep `resume_reason = resume_after_delta` truthful.
- Carry approved runtime-relevant graph truth forward without rewriting any module-local dependency truth.
- Preserve planning-time co-layer exclusions and singleton-resource constraints when building the weave.
- Namespace runtime node ids as `<module_id>::<scope_id>` and layer ids as `<module_id>::<layer_id>`.
- Weave only by shifting whole module layers relative to other module layers when dependency truth allows it.
- Do not reduce peak worker-slot demand by silently trimming tasks out of an admitted combined layer.
- Once a combined layer or epoch is admitted, all of its admitted writer scopes must remain dispatchable under that admission.
- Proof and review scopes remain subject to runtime fail-fast dispatch and need not be speculatively launched as a whole.
- If a module layer cannot be fully admitted under the intended slot budget, move that whole layer later in the weave instead of partially admitting it.
- If two ready scopes would contend for the same singleton runtime resource such as `gopeak-mcp`, they may not be admitted into the same combined epoch.
- If an already-approved single module layer itself contains multiple scopes that require the same singleton runtime resource, fail closed for replanning instead of trying to legalize that graph by partial layer admission.
- Choose the weave by minimizing `peak worker-slot demand * combined topo DAG height`.
- Preserve per-scope `model_tier` and `reasoningEffort` from approved graph truth.
- When creating or refreshing `runs/<run_id>/session.json`, keep `current_phase` truthful and initialize `yield_reason = null`, `continue_reason = null`, `resume_reason = null`, and `stop_reason = null` unless a real runner-handled yield, real continuation reason, real resume reason, or real stop already exists.
- When writing `runs/<run_id>/session.json` for unattended execution started from the top-level run surface, set `invocation.entry_surface = godot-rup-runner`.
- When writing `runs/<run_id>/session.json`, use the current active format id `godot_run_session/v4`.
- Do not create worktrees.
- Do not prepare packets.
- Do not dispatch subagents.

## Consistency gate

- Reread `runs/<run_id>/session.json` and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/session.schema.json`.
- Reread `runs/<run_id>/combined-dag.json` and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/combined-dag.schema.json`.
- Reread `runs/<run_id>/dispatch-weave.json` and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/dispatch-weave.schema.json`.
- Reread `runs/<run_id>/slot-demand.json` and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/slot-demand.schema.json`.
- Reread `runs/<run_id>/todo.json` and confirm it remains a runtime-only operator view over the written combined layers or epochs.
