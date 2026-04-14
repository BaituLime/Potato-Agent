---
name: run-craft
description: Execute one bounded Godot craft scope with editor or MCP-backed implementation feedback and write one raw attempt record. Use for interactive implementation scopes in the rebuilt runtime.
compatibility: opencode
---

# Run Craft (Godot-RUP + C#)

Use this Skill to execute one bounded Godot craft scope and write one raw attempt record.

Canonical reference:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/CHILD-PROMPT-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/LEAF-WORKER-CONTRACT.md`

## Goal

- implement one craft scope
- write one raw attempt

## Read boundary

Read from:

- one run-local packet
- files explicitly named by that packet

## Write boundary

You may write only:

- project files inside the assigned checkout and ownership boundary
- `runs/<run_id>/attempts/<module_id>/<scope_id>/<attempt_id>.json`

## Hard rules

- Execute exactly one craft packet.
- After reading the packet, move directly to bounded implementation convergence; do not expand beyond the packet, packet-listed files, and the raw attempt write path unless the packet itself requires it.
- Work only in the assigned worker checkout.
- Respect `role_contract` and `recent_execution_learnings[]` from the packet as bounded execution guidance.
- If the packet carries a blueprint markdown anchor, start with that anchored slice first. Read other blueprint sections only when the craft scope honestly needs them.
- This scope exists for Godot UI, scene, animation, and interaction work where editor or runtime feedback is part of implementation, not merely later proof.
- You may do cheap local self-checks alongside craft work.
- When the craft packet requires MCP or editor access, this scope starts and closes the editor for its own checkout.
- You may use MCP or editor-backed observation as implementation feedback, including bounded observe-edit-rerun loops on the packet's declared surface.
- When the packet requires MCP or editor access, record `feedback_surface` in the raw attempt and do not self-claim `ready_for_attest` unless the required feedback surface was actually satisfied.
- Do not present implementation feedback, local craft observations, or visual sanity passes as if they already satisfied strict proof or final acceptance.
- If convergence would require broad route reinvention, open-ended aesthetic wandering, or operator-only judgment outside the packet boundary, record that limitation explicitly instead of improvising a new workflow shape.
- Do not silently turn `craft` into final proof or acceptance authority.
- If the packet is insufficient or the work truthfully no longer fits `craft`, hand that back in raw attempt `handoff_back` instead of widening this leaf into another role.
- Write the raw attempt in the active `godot_attempt_record/v1` shape.
- Include `dispatch_audit` with the packet's requested versus actual child model and subagent values plus dispatch verification.
- Record `dispatch_mode = opencode_native_child`; do not record `direct_thread` in active runtime truth.
- You may not write authoritative `pass`.
- Record only `ready_for_attest`, `partial`, or `blocked` as self-claim.
- Do not erase or rewrite failing logs to fake clean output.
- If no prior raw attempt exists for this scope, write `attempt-001.json`; otherwise use the next zero-padded sequence for that scope.

## Consistency gate

- After writing the attempt, reread it and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/attempt-record.schema.json`.
- Ensure `scope_kind = craft`, `producer_skill = run-craft`, and `dispatch_audit.dispatch_mode = opencode_native_child`.
- If the packet required MCP/editor feedback, ensure `feedback_surface.required_by_packet = true` and keep `feedback_surface.requirement_satisfied` truthful.
- If the packet was insufficient or the role boundary was reached, ensure `handoff_back.reason_class` and `handoff_back.summary` are explicit.
