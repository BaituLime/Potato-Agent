---
name: run-proof
description: Execute one proof-producing scope such as compile, headless, MCP, harness, or fixture work, and write only a raw attempt record. Use for proof scopes in the rebuilt runtime.
compatibility: opencode
---

# Run Proof (Godot-RUP + C#)

Use this Skill to execute one proof-producing scope and write one raw attempt record.

Canonical reference:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/CHILD-PROMPT-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/LEAF-WORKER-CONTRACT.md`

## Goal

- execute exactly one proof-producing scope
- write exactly one raw attempt record

## Read boundary

Read from:

- one run-local packet
- files explicitly named by that packet

## Write boundary

You may write only:

- project files inside the assigned checkout and ownership boundary when the packet requires it
- disposable temporary proof helpers, such as bounded Python input-driver scripts, when they are only support code for the current proof scope and not retained as workflow truth
- `runs/<run_id>/attempts/<module_id>/<scope_id>/<attempt_id>.json`

## Hard rules

- Execute exactly one proof packet.
- After reading the packet, move directly to proof work; do not expand beyond the packet, packet-listed files, and the raw attempt write path unless the packet itself requires it.
- Respect `role_contract` and `recent_execution_learnings[]` from the packet as bounded execution guidance.
- If the packet carries a blueprint markdown anchor, start with that anchored slice first. Read other blueprint sections only when the proof scope honestly needs them.
- Compile, headless, MCP, harness, and fixture proof work belong here, not in the scheduler.
- When the approved proof boundary needs automated runtime interaction and no simpler built-in route is sufficient, you may create and run a bounded temporary helper such as a Python input-driver script for this proof scope.
- Such temporary helpers must execute the approved proof itself, not fabricate packets, attempts, settlements, integrations, or stop reasons.
- Remove disposable helpers before finishing unless the packet explicitly requires preserving them as project-local proof support.
- When the proof packet requires MCP, this scope starts and closes the editor for its own checkout.
- Do not treat "the editor is not already open" as a blocker for an MCP proof scope. Opening the editor for the assigned checkout is part of this scope's normal work.
- Do not rely on a pre-opened unrelated editor session or leave editor lifecycle hanging for another scope to finish. One MCP proof scope should own bootstrap, observation, and teardown end-to-end.
- When the packet requires MCP or editor feedback, record `feedback_surface` in the raw attempt and do not self-claim `ready_for_attest` unless that required surface was actually satisfied.
- Respect the packet's declared proof rigor. If the packet or its acceptance inputs require `strict` proof, do not stop at a single happy path or bootstrap sanity run.
- If you only achieved smoke-level confidence for a strict proof claim, record that limitation explicitly and do not imply full proof completion.
- Write the raw attempt in the active `godot_attempt_record/v1` shape.
- Include `dispatch_audit` with the packet's requested versus actual child model and subagent values plus dispatch verification.
- Record `dispatch_mode = opencode_native_child`; do not record `direct_thread` in active runtime truth.
- Do not write authoritative `pass`.
- Do not silently widen proof work into replanning or broad implementation redesign.
- If the packet is insufficient or the truth now requires another role or broader planning change, record that in raw attempt `handoff_back` instead of widening this leaf scope.
- Record raw command results, logs, and the first blocker.
- If no prior raw attempt exists for this scope, write `attempt-001.json`; otherwise use the next zero-padded sequence for that scope.

## Consistency gate

- After writing the attempt, reread it and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/attempt-record.schema.json`.
- Ensure `scope_kind = proof`, `producer_skill = run-proof`, and `dispatch_audit.dispatch_mode = opencode_native_child`.
- If the packet required MCP/editor feedback, ensure `feedback_surface.required_by_packet = true` and keep `feedback_surface.requirement_satisfied` truthful.
- If the packet was insufficient or the role boundary was reached, ensure `handoff_back.reason_class` and `handoff_back.summary` are explicit.
