---
name: prepare-packet
description: Compile one run-local packet from approved graph truth plus current slot assignment. Use before dispatching one scope in the rebuilt runtime.
compatibility: opencode
---

# Prepare Packet (Godot-RUP + C#)

Use this Skill to compile exactly one run-local packet from approved graph truth plus current slot assignment.

Canonical references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/SCHEDULER-RULES.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/RUNTIME-ARTIFACT-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/PLANNING-ARTIFACT-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/EXECUTION-ROLE-MAP.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/CHILD-PROMPT-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/LEAF-WORKER-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/EXECUTION-LEARNINGS-CONTRACT.md`

## Goal

- write exactly one run-local packet

## Read boundary

Read from:

- approved planning truth
- authoritative markdown `Execution Blueprint` plus companion index for the scope's `source_realization_ids[]`
- `runs/<run_id>/slot-table.json`
- `runs/<run_id>/modules/<module_id>.json`
- `runs/<run_id>/session.json`

## Write boundary

You may write only:

- `runs/<run_id>/packets/<module_id>/<scope_id>.json`

## Hard rules

- Prepare one scope at a time.
- Copy approved truth; do not reinterpret it.
- Carry the assigned slot, checkout, module branch, approved `graph_revision_id`, approved joint dispatch pair `model_tier + reasoningEffort`, and resolved dispatch fields without reinterpretation.
- Preserve planning-artifact path semantics from graph truth. Handoff planning files should stay handoff-root absolute; checkout-relative project paths should stay project-relative.
- Current-format graph tasks must carry `source_realization_ids[]`; project the matching rehearsal-local execution truth into packet `source_realization_ids[]` plus a narrow but detail-rich `blueprint_excerpt`, and also carry the exact blueprint markdown anchor as `source_markdown_path + source_line_offset + source_line_length` so producer children know where to start reading first instead of freeforming from the whole blueprint.
- If the graph carries blueprint linkage but the referenced blueprint revision or realization ids cannot be resolved cleanly, fail closed instead of fabricating a packet.
- Resolve `producer_command` from the scope's producer kind and resolve that joint dispatch pair into `resolved_subagent_type`, `resolved_model`, and `resolved_reasoningEffort` from the active custom-agent table.
- Current active resolver table is: `full + medium -> godot-rup-exec-full-medium`, `full + high -> godot-rup-exec-full-high`, `full + xhigh -> godot-rup-exec-full-xhigh`, `mini + high -> godot-rup-exec-mini-high`, `mini + xhigh -> godot-rup-exec-mini-xhigh`, with explicit normalization `mini + medium -> godot-rup-exec-mini-high`.
- If no approved child profile exists for the scope, fail closed instead of inventing another route.
- Write the packet in the active `godot_run_packet/v2` shape, not any legacy packet shape.
- Use `scope_id`, `scope_kind`, `graph_kind`, `layer_id`, and `acceptance_inputs`.
- Do not use legacy keys such as `task_id`, `kind`, `topo_layer`, or `acceptance`.
- Carry `role_contract` that truthfully fixes `primary_role`, `success_shape`, `handoff_back_when[]`, and `must_not_do[]` for this exact leaf scope.
- Do not write decorative `role_contract` text. `handoff_back_when[]` and `must_not_do[]` must contain concrete, scope-relevant entries rather than empty or generic filler.
- Carry at most five `recent_execution_learnings[]` from the current module session as bounded same-route execution guidance. If none exist, write an empty array rather than omitting the field.
- Do not turn `recent_execution_learnings[]` into replacement planning truth or broad redesign guidance.
- When carrying `blueprint_excerpt`, point it at the exact markdown slice that grounded the packet. Prefer the immutable blueprint-history revision markdown path over a mutable latest alias whenever that revision file exists.
- Set `dispatch_verification_required = true`.
- Preserve each accepted `acceptance_inputs[].proof_rigor` value from graph truth; do not silently drop or reinterpret it while compiling the packet.
- If `scope_kind` is `craft`, `proof`, or `review` and `resources_required[]` includes an MCP/editor resource, the packet may not frame producer-local editor bootstrap or teardown as a forbidden shortcut. That lifecycle belongs to the producer scope itself.
- If `scope_kind` is `craft`, keep the packet truthful that MCP/editor use is implementation feedback inside execution, not final proof satisfaction by itself.
- Keep the packet minimal.
- Do not dispatch subagents.

## Consistency gate

- After writing the packet, reread it and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/run-packet.schema.json`.
- Confirm the packet preserves the approved `graph_revision_id` and joint dispatch pair `model_tier + reasoningEffort`, and writes the resolved `resolved_subagent_type`, `resolved_model`, `resolved_reasoningEffort`, and `producer_command` that will actually be used for child dispatch.
- When source-realization linkage exists in graph truth, confirm the packet also carries matching `source_realization_ids[]` plus a truthful `blueprint_excerpt` that preserves why the realization exists, primary flow, alternate/failure flow handling, authority rules, critical details, parallel/convergence truth, and forbidden shortcuts needed for execution.
- Confirm `blueprint_excerpt.source_markdown_path`, `source_line_offset`, and `source_line_length` point at the exact authoritative blueprint slice used for this packet.
- Confirm every carried `acceptance_inputs[]` entry still includes its approved `proof_rigor`.
- Confirm the packet carries `role_contract.primary_role` that matches `scope_kind`.
- Confirm `role_contract.handoff_back_when[]` and `role_contract.must_not_do[]` are both non-empty and scope-relevant.
- Confirm any `recent_execution_learnings[]` stay narrow, execution-relevant, same-route, and bounded.
- If the packet requires MCP/editor access for a craft, proof, or review scope, confirm the carried `blueprint_excerpt` does not contradict producer-local editor bootstrap/teardown ownership.
- If the packet is `scope_kind = craft`, confirm the carried excerpt does not silently collapse that scope into final proof or acceptance authority.
- Remember that `producer_command` is audit-only for the child API; the producer prompt remains authoritative.
- If the packet still reflects a legacy shape, treat preparation as failed instead of leaving a half-migrated packet behind.
