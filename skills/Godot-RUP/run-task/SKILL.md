---
name: run-task
description: Execute one bounded implementation scope inside its assigned worker checkout and write only a raw attempt record. Use for ordinary execution scopes in the rebuilt runtime.
compatibility: opencode
---

# Run Task (Godot-RUP + C#)

Use this Skill to execute one bounded implementation scope and write one raw attempt record.

Canonical reference:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/CHILD-PROMPT-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/LEAF-WORKER-CONTRACT.md`

## Goal

- implement one execution scope
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

- Execute exactly one packet.
- After reading the packet, move directly to execution; do not expand beyond the packet, packet-listed files, and the raw attempt write path unless the packet itself requires it.
- Work only in the assigned worker checkout.
- Respect `role_contract` and `recent_execution_learnings[]` from the packet as bounded execution guidance.
- If the packet carries a blueprint markdown anchor, start with that anchored slice first. Read other blueprint sections only when the task honestly needs them.
- You may do cheap local self-checks.
- Ordinary implementation scopes should not depend on MCP/editor lifecycle. If a scope cannot be completed honestly without editor-mediated implementation feedback as a primary runtime resource, it should usually have been classified as `craft`, not widened silently here.
- Do not treat a pre-opened editor session as a hidden prerequisite for `run-task`.
- Do not present a cheap sanity check or happy-path run as if it satisfied a packet input that requires strict proof.
- Write the raw attempt in the active `godot_attempt_record/v1` shape.
- Include `dispatch_audit` with the packet's requested versus actual child model and subagent values plus dispatch verification.
- Record `dispatch_mode = opencode_native_child`; do not record `direct_thread` in active runtime truth.
- You may not write authoritative `pass`.
- Record only `ready_for_attest`, `partial`, or `blocked` as self-claim.
- Do not erase or rewrite failing logs to fake clean output.
- Do not widen a `task` scope into `craft`, `proof`, or replanning because the child thinks that would be convenient.
- If the packet is insufficient or the work truthfully belongs to another role, hand that back in raw attempt `handoff_back` instead of silently widening this leaf scope.
- If no prior raw attempt exists for this scope, write `attempt-001.json`; otherwise use the next zero-padded sequence for that scope.

## Consistency gate

- After writing the attempt, reread it and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/attempt-record.schema.json`.
- Ensure `scope_kind = task`, `producer_skill = run-task`, and `dispatch_audit.dispatch_mode = opencode_native_child`.
- If the packet was insufficient or the role boundary was reached, ensure `handoff_back.reason_class` and `handoff_back.summary` are explicit instead of hiding that truth only in prose.
