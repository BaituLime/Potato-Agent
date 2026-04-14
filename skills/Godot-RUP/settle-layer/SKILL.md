---
name: settle-layer
description: Settle one drained layer inside one context by first attesting raw scope outputs and then gating the layer to `review`, `integrate`, `rework_needed`, `manual_needed`, `blocked`, or `ready_for_acceptance`. Use after a layer drains through ordinary completion or fail-fast proof/review stop.
compatibility: opencode
---

# Settle Layer (Godot-RUP + C#)

Use this Skill to settle one drained layer in two hard phases: `attest` then `gate`.

Canonical references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/SCHEDULER-RULES.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/RUNTIME-ARTIFACT-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/PLANNING-ARTIFACT-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/EXECUTION-LEARNINGS-CONTRACT.md`

## Goal

- perform `attest`
- then perform `gate`

## Read boundary

Read from:

- the drained layer's packets
- the drained layer's raw attempts
- approved graph truth
- `runs/<run_id>/modules/<module_id>.json`
- `runs/<run_id>/session.json`

## Write boundary

You may write only:

- authoritative `evidence/<module_id>/<scope_id>/summary.json` for scopes first settled here
- `runs/<run_id>/settlements/<module_id>/<layer_id>.json`
- `runs/<run_id>/modules/<module_id>.json`
- `runs/<run_id>/session.json`

## Hard rules

- Keep both stages in one context; do not reload the same layer into a second settlement agent.
- `attest` must finish before `gate` starts.
- `attest` may aggregate existing proof outputs and run only minimal settlement-local consistency checks; it may not originate new compile, headless, MCP, harness, or fixture proof work.
- `attest` may not silently upgrade smoke evidence into a strict pass; if the produced evidence is only happy-path or sanity-level, keep that limitation explicit for `gate`.
- Only `attest` may convert raw attempts into authoritative scope summaries.
- `attest` may settle a fail-fast-drained layer from the returned raw attempts plus approved graph truth; do not fabricate missing raw attempts for untouched proof/review siblings that were intentionally withheld after a decisive non-ready result.
- `gate` reads only approved graph truth plus the just-written authoritative summaries.
- `gate` may not rerun checks.
- This Skill may write only `pass`, `rework_needed`, or `blocked` for settled scopes.
- `gate` may not pretend untouched fail-fast-withheld proof/review siblings were executed or passed.
- If a raw attempt carries `handoff_back`, keep that boundary signal explicit; do not pretend the scope passed unchanged or silently erase the role or packet mismatch.
- If a packet required editor or MCP-backed feedback and the raw attempt does not truthfully show `feedback_surface.requirement_satisfied = true`, do not write authoritative scope evidence as if that requirement was satisfied.
- This Skill may route the layer only to `review`, `integrate`, `rework_needed`, `manual_needed`, `blocked`, or `ready_for_acceptance`.
- If `gate` chooses `rework_needed`, keep that as layer-local authoritative truth; do not also invent a session-level `global_blocked` narrative here.
- If automatic proof is blocked by the current host environment and bounded automation for the same approved proof boundary was honestly attempted or ruled out, `gate` should choose `manual_needed` when a concrete operator action is still the next legal step.
- Wayland/input/display limits should first trigger bounded automation attempts, such as temporary input-driving helpers, before being treated as `manual_needed`.
- Deciding whether that layer-local `rework_needed` can be absorbed by an already-approved repair continuation or must escalate to a session-level `replan_needed` stop belongs to `orchestrate-runtime`.
- Do not invent `yield_reason`, `continue_reason`, `resume_reason`, `dispatch_refresh_needed`, or a final session stop here; `orchestrate-runtime` owns runner-handled yields, continuation semantics, and final stop-policy transitions.
- This Skill may not integrate branches.
- When updating `runs/<run_id>/modules/<module_id>.json`, distill at most five narrow same-route `recent_execution_learnings[]` from the drained layer's raw attempts when such learnings would help later scopes in the same module. Keep them concrete, execution-relevant, and non-planning.

## Consistency gate

- Reread each new `evidence/<module_id>/<scope_id>/summary.json` and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/evidence-summary.schema.json` with `summary_format = godot_evidence_summary/v4`.
- Reread `runs/<run_id>/settlements/<module_id>/<layer_id>.json` and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/layer-settlement.schema.json` with `settlement_format = godot_layer_settlement/v1`.
- Keep `runs/<run_id>/modules/<module_id>.json` and `runs/<run_id>/session.json` aligned with the written gate result; do not leave settlement state half-updated.
- If `recent_execution_learnings[]` was updated, confirm it remains bounded, same-route, and execution-relevant rather than turning into shadow planning.
