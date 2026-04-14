---
title: Godot-RUP handoff contract
status: active-rebuild
language: C#
---

# Godot-RUP Handoff Contract

This document defines the active persisted artifacts for the rebuilt `godot` workflow.

High-frequency execution surfaces should prefer `RUNTIME-ARTIFACT-CONTRACT.md` and `PLANNING-ARTIFACT-CONTRACT.md` instead of reopening this aggregate file by default.

Authority split:

- this document is authoritative for artifact families, concrete file paths, and schema locations
- runtime and acceptance behavior semantics live in `RUN-SESSION-CONTRACT.md`, `EXECUTION-PROGRAM.md`, and `ACCEPTANCE-PROGRAM.md`
- skill and top-level surface boundary rules live in `HANDOFF-SKILL-SPEC.md`

## Active artifact families

Planning-owned:

- `context/context.json`
- `use-cases/<module_id>.md`
- `use-cases/<module_id>.json`
- `use-cases-history/<module_id>/<use_case_design_revision_id>.md`
- `use-cases-history/<module_id>/<use_case_design_revision_id>.json`
- `decision/<module_id>.json`
- `decision/<module_id>.md`
- `blueprint/<module_id>.draft.md`
- `blueprint/<module_id>.draft.json`
- `blueprint/<module_id>.md`
- `blueprint/<module_id>.json`
- `blueprint-history/<module_id>/<blueprint_revision_id>.md`
- `blueprint-history/<module_id>/<blueprint_revision_id>.json`
- `graph/<module_id>.json`
- `graph-history/<module_id>/<graph_revision_id>.json`

Spike-owned optional planning records:

- `spikes/<module_id>/<spike_id>.json`

Runtime-owned:

- `runs/<run_id>/session.json`
- `runs/<run_id>/scheduler-return.json`
- `runs/<run_id>/combined-dag.json`
- `runs/<run_id>/dispatch-weave.json`
- `runs/<run_id>/slot-demand.json`
- `runs/<run_id>/slot-table.json`
- `runs/<run_id>/todo.json`
- `runs/<run_id>/modules/<module_id>.json`
- `runs/<run_id>/packets/<module_id>/<scope_id>.json`
- `runs/<run_id>/attempts/<module_id>/<scope_id>/<attempt_id>.json`
- `runs/<run_id>/settlements/<module_id>/<layer_id>.json`
- `runs/<run_id>/integrations/<module_id>/<layer_id>.json`
- `runs/<run_id>/acceptance/<module_id>/dossier.json`
- `runs/<run_id>/acceptance/<module_id>/human-review-brief.json`
- `runs/<run_id>/acceptance/<module_id>/human-review-record.json`

Proof-owned:

- `evidence/<module_id>/<scope_id>/summary.json`
- optional `evidence/<module_id>/<scope_id>/notes.md`

## Schema authority

All `schemas/...` references in this workflow resolve under this bundled skill-tree directory:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/`

Active machine schemas therefore live under:

- `schemas/decision-handoff.schema.json`
- `schemas/use-case-design.schema.json`
- `schemas/execution-blueprint.schema.json`
- `schemas/graph-handoff.schema.json`
- `schemas/evidence-summary.schema.json`
- `schemas/session.schema.json`
- `schemas/scheduler-return.schema.json`
- `schemas/combined-dag.schema.json`
- `schemas/dispatch-weave.schema.json`
- `schemas/slot-demand.schema.json`
- `schemas/slot-table.schema.json`
- `schemas/todo.schema.json`
- `schemas/module-session.schema.json`
- `schemas/run-packet.schema.json`
- `schemas/attempt-record.schema.json`
- `schemas/layer-settlement.schema.json`
- `schemas/integration-record.schema.json`
- `schemas/acceptance-dossier.schema.json`
- `schemas/human-review-brief.schema.json`
- `schemas/human-review-record.schema.json`

Deprecated runtime schemas live under:

- `schemas_deprecated/`

## Planning artifacts

`context/context.json`

- stable project facts
- discovered tools
- proof-boundary facts
- reusable systems

`use-cases/<module_id>.md`

- latest approved use-case-design alias
- authoritative operator-facing contract for the module
- records approved key use cases, acceptance-sensitive behavior claims, out-of-scope boundary, and open questions
- is the primary planning truth for what the module must let the operator do, see, or experience before technical route selection

`use-cases/<module_id>.json`

- latest approved use-case-design alias
- carries the active `use_case_design_revision_id`
- points to the authoritative markdown use-case-design artifact
- is a thin companion index only
- records stable use-case ids and acceptance-sensitive claim ids for downstream referencing

`use-cases-history/<module_id>/<use_case_design_revision_id>.md`

- immutable archived authoritative use-case-design revision

`use-cases-history/<module_id>/<use_case_design_revision_id>.json`

- immutable archived companion index for that same use-case-design revision

`decision/<module_id>.json`

- approved route
- should record which approved use-case-design revision the route was chosen against
- user-visible done definition and experiential acceptance expectations, carried forward from the approved use-case design unless that upstream truth was explicitly regated
- must-preserve rules
- forbidden simplifications
- structured workflow and acceptance plan
- `repair_policy` controlling whether lawful same-route delegated delta planning is allowed after ordinary execution-side repair proves insufficient, including `mode`, allowed result classes, preservation guards, and `max_same_route_delta_per_run` interpreted against the uninterrupted unattended route lineage

`decision/<module_id>.md`

- human-readable companion summary for the approved module decision
- mirrors the approved route, constraints, and acceptance intent for operator review
- may not contradict `decision/<module_id>.json`; when they differ, the JSON artifact is authoritative

`blueprint/<module_id>.draft.md`

- current non-authoritative blueprint draft alias
- full English planning draft used before `DG-BLUEPRINT-*`
- must not be treated as approved planning truth

`blueprint/<module_id>.draft.json`

- current non-authoritative draft companion index
- must mirror the current draft markdown enough for review and later promotion
- must not be treated as approved planning truth

`blueprint/<module_id>.md`

- latest approved execution blueprint alias
- authoritative narrative rehearsal for the module
- records the approved implementation route for the module, coverage against the already-approved use-case design, plus shared route decisions, derived parallelization/convergence, out-of-scope boundary, and open questions
- is the primary planning truth for blueprint semantics

`blueprint/<module_id>.json`

- latest approved execution blueprint alias
- carries the active `blueprint_revision_id`
- should record which approved use-case-design revision it is rehearsing
- points to the authoritative markdown blueprint
- is a thin companion index only
- records stable use-case ids, shared-route-decision ids, realization ids, and derived dependency/parallel/convergence linkage for downstream referencing
- may not become a competing narrative or a schema-driven substitute for the markdown rehearsal

`blueprint-history/<module_id>/<blueprint_revision_id>.md`

- immutable archived authoritative blueprint revision

`blueprint-history/<module_id>/<blueprint_revision_id>.json`

- immutable archived companion index for that same blueprint revision

`graph/<module_id>.json`

- latest approved module-local DAG alias
- carries the active `graph_revision_id`
- must pin the `source_blueprint_revision_id` it was compiled from
- may supersede an earlier approved graph revision but may not erase revision history
- strict MVP-bounded task split
- tasks must map back to approved blueprint realization ids through `source_realization_ids[]` instead of inventing execution shape ad hoc
- explicit dependency truth plus planning-owned parallelism hints
- module acceptance-support scopes, especially proof scopes generated from the acceptance backchain pass
- per-scope dispatch settings
- active per-scope dispatch settings are the joint pair `model_tier + reasoningEffort`
- task `kind`, when present, is semantic task-role metadata only and is not part of dispatch selection
- `module_acceptance.required_evidence[]` and `tasks[].acceptance_inputs[]` must explicitly declare `proof_rigor`
- smoke evidence may not silently substitute for strict behavior or acceptance claims
- when active planning truth enables repair automation, graph truth carries the active `repair_policy` so runtime and runner behavior do not guess from chat memory; any superseding same-route graph must preserve or tighten that carried policy rather than dropping or widening it
- retired planning keys such as `reasoning_effort`, `verbosity`, and planning-level `subagent_type` may not appear in active graph truth

`graph-history/<module_id>/<graph_revision_id>.json`

- immutable archived graph revision
- preserves earlier approved DAG state when later delta planning supersedes it
- previous revisions may be cited by old run packets, run sessions, and acceptance dossiers for audit

`spikes/<module_id>/<spike_id>.json`

- one optional planning-stage spike result
- temporary validation for one technical uncertainty before route or workflow commitment hardens
- may inform later decision gates, but is not runtime evidence and does not count as final module acceptance evidence

## Run-session artifacts

`session.json`

- one unattended execution or acceptance session
- requested modules
- valid only for the exact graph revisions pinned by that run's module-session files
- valid only when `session.json` and all requested `modules/<module_id>.json` files already match the active runtime machine shapes for reuse
- `lineage_run_id` for the uninterrupted unattended route lineage
- `previous_run_id` when this run is a fresh successor rather than a lineage root
- top-level entry-surface metadata for the active unattended route
- parent model
- current phase
- yield reason for runner-handled internal returns
- stop reason for real user-facing or terminal stops only

`scheduler-return.json`

- runner-owned reverse-gate receipt for the most recent returned scheduler slice
- records whether that return may surface to the user or must stay inside the unattended loop
- derived from reread `session.json` and touched module session files, not from scheduler prose
- may not override run truth; it only records the runner shell's gate decision for one return boundary

`combined-dag.json`

- namespaced multi-module runtime graph
- ids use `<module_id>::<scope_id>`

`dispatch-weave.json`

- combined-layer weave used to lower peak worker-slot demand
- whole-layer weaving only; no partial layer admission
- optimization objective is minimize `peak worker slots * combined topo DAG height`
- runtime-only

`slot-demand.json`

- computed peak worker slots
- total worktree slots equal peak worker slots plus one fixed integration slot per active module
- fixed integration slots

`slot-table.json`

- real repo-local integration and worker slots
- current slot occupancy truth
- after smooth execution completion, or after a later deferred-retirement decision for a blocked run, worker slots may be marked `cleaned` when `cleanup-run-worktrees` removes `.worktrees/runs/<run_id>/worker-*`
- after successful ship, integration slots may be marked `cleaned` when `cleanup-worktrees` removes the module integration checkout

`todo.json`

- operator-readable combined epoch and scope list
- non-authoritative progress view only; runtime may not branch on stale `todo.json` status when `session.json` or `modules/<module_id>.json` disagree

`modules/<module_id>.json`

- module-local run-session state
- status, including `accepted` after acceptance promotion and `done` after shipping
- active `graph_revision_id` for this module inside the current run session
- lineage-carried same-route delta bookkeeping such as `delta_attempt_count`, last result class, truthful superseded/new revision ids, and `delta_history_refs`
- `status = manual_needed` means the approved route still stands but the next legal step is an explicit operator action after bounded automation for the same approved boundary was honestly attempted or ruled out
- `status = replan_needed` means unattended execution can no longer continue honestly inside the current same-route repair allowance; lawful same-route delta planning either is not allowed, cannot preserve the required invariants, or has started looping instead of converging
- `open_blockers` is live blocker truth; `notes` are explanatory history and may preserve cleared blocker text without reopening the blocker
- notes may record post-ship cleanup of repo-local worktrees without changing shipping authority
- `last_mainline_commit` when explicit ship/mainline integration has completed
- active layer ids
- admitted scopes
- settled scopes
- pending review scopes
- pending integration layers
- readiness for acceptance
- bounded same-route `recent_execution_learnings[]` that later packet preparation may project into packet `recent_execution_learnings[]`

`packets/<module_id>/<scope_id>.json`

- one run-local dispatch packet
- includes assigned slot, checkout, branch, and dispatch settings
- must use the active `godot_run_packet/v2` machine shape
- may not use legacy packet keys such as `task_id`, `kind`, `topo_layer`, or `acceptance`
- pins the exact planning revision with `graph_revision_id`
- for current-format graph truth, packet preparation carries `source_realization_ids[]` plus a narrow but detail-rich `blueprint_excerpt`, and that excerpt must include an exact blueprint markdown anchor through `source_markdown_path + source_line_offset + source_line_length` instead of forcing producer children to reread the whole blueprint
- carries `acceptance_inputs[]` with explicit `proof_rigor` from planning truth
- includes planned `model_tier` and `reasoningEffort`, plus resolved `resolved_subagent_type`, `resolved_model`, `resolved_reasoningEffort`, and `producer_command`
- `prepare-packet` resolves those runtime dispatch fields from the active custom-agent table; current active normalization is `mini + medium -> godot-rup-exec-mini-high`
- includes discriminator fields `scope_kind` and `graph_kind`
- includes `role_contract` with non-empty handback and forbidden-widening guidance for the leaf worker
- includes bounded `recent_execution_learnings[]`, which may be empty but may not be omitted from the active packet shape

## Attempt versus evidence split

`attempts/...`

- raw producer output from `run-task`, `run-craft`, `run-proof`, or `run-review`
- includes discriminator fields such as `scope_kind` and `producer_skill`
- includes `dispatch_audit` with requested planning settings plus resolved versus actual child model and agent values, the mirrored `producer_command`, and dispatch verification
- active runtime truth records `dispatch_mode = opencode_native_child`; unattended execution may not use `direct_thread`
- may contain self-claim, raw checks, diff refs, logs, first blocker, optional structured `handoff_back`, and optional `feedback_surface`
- may not claim authoritative pass

`evidence/.../summary.json`

- authoritative scope proof written by `settle-layer`
- may claim `pass` only after settlement authority
- `proofs[]` should record whether each cited proof was `smoke` or `strict` so later acceptance can reject optimistic smoke substitution

## Settlement and integration artifacts

`settlements/<module_id>/<layer_id>.json`

- one drained layer's authoritative settlement
- a layer may drain either after all admitted scopes returned or after fail-fast proof/review dispatch withheld untouched sibling proof/review scopes following a decisive non-ready raw attempt
- contains both `attest` and `gate` result
- may route the layer to `review`, `integrate`, `rework_needed`, `manual_needed`, `blocked`, or `ready_for_acceptance`
- `rework_needed` here is layer-local truth; if no already-approved repair continuation exists, runtime escalates the session to `replan_needed`
- `manual_needed` here means the approved route still stands but the next legal step is an explicit operator action after bounded automation for the same approved proof boundary was honestly attempted or ruled out

`integrations/<module_id>/<layer_id>.json`

- one real per-module integration action
- must record the resulting commit hash when integration succeeds

## Acceptance artifacts

`runs/<run_id>/acceptance/<module_id>/human-review-brief.json`

- optional structured human-review guide when `acceptance_plan.human_review_plan` requires at least one review track for the module
- concise guided try-it flow plus technical walkthrough context such as implementation map, scene anchors, Godot lifecycle map, extension points, and evidence map

`runs/<run_id>/acceptance/<module_id>/human-review-record.json`

- optional recorded explicit human-review result when `acceptance_plan.human_review_plan` requires at least one review track for the module
- when this artifact exists because a review track gates acceptance, the corresponding recorded `gating_verdict = pass` is required before `accept-module` may write a passing final acceptance summary
- keeps required human-review truth concrete instead of transient chat prose

`runs/<run_id>/acceptance/<module_id>/dossier.json`

- collected acceptance bundle
- approved `decision/<module_id>.json` and `graph/<module_id>.json`
- module-session, settlement, and integration path refs for the integrated state under review
- authoritative evidence refs using concrete paths
- checklist inputs that preserve expected proof type, expected proof rigor, pass criterion, explicit evidence collection status, and the concrete evidence paths used for acceptance judgment
- the carried `human_review_plan` so later human-review and final acceptance steps do not guess review requirements from chat memory

`evidence/<module_id>/module-acceptance/summary.json`

- final authoritative module acceptance result
- uses the active evidence-summary machine shape with `kind = acceptance`
- uses `scope_id = module-acceptance`
- preserves exact acceptance readback inputs plus exact checklist judgment over required evidence

Disposable acceptance checkouts, when final proof still requires one, are local to `accept-module` and are not tracked in `slot-demand.json` or `slot-table.json`.

## Hard authority rules

- planning artifacts may not be rewritten by runtime
- when planning truth is superseded, the prior `graph/<module_id>.json` must first be archived as an immutable `graph-history/<module_id>/<graph_revision_id>.json` revision instead of being silently discarded
- active planning truth may use only the joint dispatch pair `model_tier + reasoningEffort` for per-scope dispatch; task-role metadata may not substitute for that pair, and retired planning keys such as `reasoning_effort`, `verbosity`, and planning-level `subagent_type` may not be reintroduced
- planning truth must explicitly classify required evidence and acceptance inputs as `smoke` or `strict`; proof rigor may not be left implicit
- operator-visible behavior claims may not be satisfied by smoke evidence unless the approved decision explicitly narrowed the claim to smoke-level viability
- `dag-plan` owns the initial MVP task split, dependency truth, and planning parallelism hints for a module-local graph revision
- `repair-delta-plan` may supersede graph truth only for lawful same-route `graph_delta_only` or `blueprint_plus_graph_delta` results
- `execution-blueprint` owns the approved implementation route, coverage against the approved use-case design, shared route decisions, and derived parallelization/convergence that downstream workflow and DAG planning must consume rather than reinvent
- current-format graph revisions compiled from an execution blueprint must record `source_blueprint_revision_id`, and their tasks must record `source_realization_ids[]`
- when that realization linkage exists, packet preparation must project a narrow but detail-rich `blueprint_excerpt` with an exact blueprint markdown anchor instead of requiring producer children to reread the full blueprint
- producer attempts may not replace authoritative evidence
- only `cleanup-run-worktrees` may claim post-execution run worker cleanup in runtime state
- `settle-layer` may not integrate branches
- `integrate-layer` may not claim integration without real git state change
- `integrate-main` may not claim shipping or mainline integration without real mainline git state change
- only `integrate-main` may set a module status to `done` or record `last_mainline_commit`
- only `cleanup-worktrees` may claim post-ship worktree cleanup in runtime state
- `session.stop_reason = all_done` is valid only after every requested module is `done`
- `accept-module` may not reopen planning truth
- only `execution-blueprint` may write ordinary blueprint draft aliases and promote them into approved blueprint aliases; `repair-delta-plan` may write `blueprint/<module_id>.md`, `blueprint/<module_id>.json`, and `blueprint-history/<module_id>/...` only when authoring a lawful same-route `blueprint_plus_graph_delta`
- only `prepare-user-review-brief` may write `runs/<run_id>/acceptance/<module_id>/human-review-brief.json`, and only when planning truth requires at least one human-review track for that module
- only `record-user-review-gate` may write `runs/<run_id>/acceptance/<module_id>/human-review-record.json`, and only when planning truth requires at least one human-review track for that module
- `godot-rup-runner` may not promote `accepted`
- only the top-level `accept` route owned by `godot-rup-acceptor` may promote `accepted`, and only after rereading written current-format exact passing acceptance evidence plus any required human-review record with the needed acceptance-gating `pass` verdicts
- `repair-delta-plan` may not write runtime state directly; runtime state updates remain runner-owned
- runtime state and packets may not be fabricated through ad hoc scripts outside the owning skill's declared boundary; bounded temporary proof helpers are allowed only when they execute the approved proof itself
