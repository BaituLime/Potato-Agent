---
name: run-review
description: Review one selected scope inside the rebuilt runtime and write only a raw review attempt. Use only for graph-selected review scopes, not for ordinary task completion.
compatibility: opencode
---

# Run Review (Godot-RUP + C#)

Use this Skill to judge one selected review scope and write one raw review attempt.

Canonical references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/CHILD-PROMPT-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/LEAF-WORKER-CONTRACT.md`

## Goal

- judge one selected review scope
- write one raw review attempt

## Read boundary

Read from:

- one run-local packet
- reviewed diffs, files, and evidence explicitly named by that packet

## Write boundary

You may write only:

- `runs/<run_id>/attempts/<module_id>/<scope_id>/<attempt_id>.json`

## Hard rules

- Read and judge only.
- Review exactly one selected scope.
- After reading the packet, move directly to the listed review inputs and the raw attempt write path; do not broaden discovery beyond that bounded read set.
- Respect `role_contract` and `recent_execution_learnings[]` from the packet as bounded execution guidance.
- If the packet carries a blueprint markdown anchor, start with that anchored slice first. Read other blueprint sections only when the review scope honestly needs them.
- Do not edit implementation code.
- When the review packet requires MCP, this scope starts and closes the editor for its own checkout.
- Do not treat "the editor is not already open" as a blocker for an MCP review scope. Opening the editor for the assigned checkout is part of this scope's normal work.
- Do not rely on a pre-opened unrelated editor session or split one live editor lifecycle across several review scopes.
- When the packet requires MCP or editor feedback, record `feedback_surface` in the raw attempt and do not self-claim `ready_for_attest` unless that required surface was actually satisfied.
- Write the raw attempt in the active `godot_attempt_record/v1` shape.
- Include `dispatch_audit` with the packet's requested versus actual child model and subagent values plus dispatch verification.
- Record `dispatch_mode = opencode_native_child`; do not record `direct_thread` in active runtime truth.
- Do not write authoritative `pass`.
- Record only `ready_for_attest`, `partial`, or `blocked` as the raw attempt status.
- Findings, missing proof, and the first blocker must stay explicit in the raw review attempt.
- Call out optimistic smoke substitution explicitly when a smoke sanity run is being presented as if it satisfied a strict proof obligation.
- Do not silently turn review into a fresh planning pass.
- If the packet is insufficient or the truth now requires implementation, another role, or broader planning change, hand that back in raw attempt `handoff_back` instead of widening review authority.
- Do not erase or rewrite failing logs to make the review look clean.
- If no prior raw attempt exists for this scope, write `attempt-001.json`; otherwise use the next zero-padded sequence for that scope.

## Consistency gate

- After writing the attempt, reread it and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/attempt-record.schema.json`.
- Ensure `scope_kind = review`, `producer_skill = run-review`, and `dispatch_audit.dispatch_mode = opencode_native_child`.
- If the written attempt implies authoritative evidence instead of raw review output, treat the review as failed instead of leaving a misleading record behind.
- If the packet required MCP/editor feedback, ensure `feedback_surface.required_by_packet = true` and keep `feedback_surface.requirement_satisfied` truthful.
- If the packet was insufficient or the role boundary was reached, ensure `handoff_back.reason_class` and `handoff_back.summary` are explicit.
