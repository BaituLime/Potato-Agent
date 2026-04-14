---
name: workflow-design
description: Design the high-level workflow shape and Decision Gates for one ring iteration
compatibility: opencode
---

# Workflow Design (Godot-RUP + C#)

Use this Skill to decide which workflow steps and `Decision Gates` are active for one `Ring Iteration` of one Module after the execution blueprint is approved.

Canonical references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/TERMS.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-SKILL-SPEC.md`

## Goal

Recommend the workflow shape and module acceptance plan for this run, then write the approved workflow decisions into the `Decision Handoff`.

This Skill maps already-approved use-case semantics plus the approved route and approved execution blueprint to workflow and proof requirements. It does not get to redefine what "done" means or replace the approved implementation route preplay.

Reread the canonical common workflow docs before inheriting structure from existing handoff artifacts. Older handoff files may provide module context, but they may not override active workflow rules.

## Read boundary

Read from:

- `Context Handoff`
- approved `Use-Case Design`
- current `Decision Handoff`
- approved `Execution Blueprint`
- the latest user direction for this Module or Ring Iteration

## Write boundary

You may write only:

- `Decision Handoff`

Only write approved workflow decisions after the user passes the relevant `Decision Gate`.

## Required output shape

The written `Decision Handoff` must include:

- `workflow_steps`
- `decision_gates`
- the already-approved `DG-BLUEPRINT-*` gate entry once an execution blueprint exists for the module
- `final_acceptance_expectations`
- `acceptance_plan.strategy`
- `repair_policy` when repair automation is being explicitly decided for this module
- `acceptance_plan.human_review_plan`
- `acceptance_plan.required_checks`
- `acceptance_plan.required_resources`
- `acceptance_plan.required_evidence[]` as structured checklist entries

Each `required_evidence[]` entry must include:

- `evidence_id`
- `description`
- `required_proof_type`
- `proof_rigor`
- `pass_criterion`

Do not leave acceptance proof requirements as prose-only notes.

Before writing, make sure the accepted planning truth already states whether completion is operator-visible behavior, structural existence, or both. If that contract is still ambiguous, stop and return to `use-case-design` instead of choosing a proof mode here.

## Decide here

- which workflow steps are active in this Ring Iteration
- which `Decision Gates` are mandatory before execution continues
- whether human review is required before or alongside final module acceptance
- whether a `Spike` is required before graph planning or execution
- whether independent review is part of this run at all
- which co-layer exclusions must be preserved
- whether any constrained runtime resource such as MCP must be treated as singleton execution capacity with one-at-a-time scope admission
- whether repair stays `manual_only` after `replan_needed`, or whether this module explicitly enables lawful same-route delegated delta planning
- how module acceptance is judged after graph work completes
- which proof modes module acceptance requires, such as `compile`, `headless`, `snapshot_round_trip`, `scene_structure_proof`, or `behavior_proof`
- which required evidence is only `smoke` sanity and which is full `strict` proof
- whether execution tasks must prepare acceptance support such as fixtures, harnesses, probes, or strict automated proof runs
- whether MCP-backed craft, proof, or review should stay as one self-contained scope that owns editor lifecycle end-to-end rather than splitting one live editor session across several scopes
- which approved blueprint use-case realizations deserve explicit human review because their failure modes are expensive, easy to fake, or worth learning through guided walkthrough

## Human review rule

- `workflow-design` decides the module's `acceptance_plan.human_review_plan` directly; acceptance must not guess human review from feature type alone.
- Use checkbox-style booleans rather than a single mode enum.
- `experience_review.required` means the user should actually try the module as an operator.
- `experience_review.gates_acceptance` means the recorded experience review must explicitly pass before `accepted` is lawful.
- `tech_lead_review.required` means the workflow should include a guided technical walkthrough so the reviewer can actually understand the module and its Godot integration.
- `tech_lead_review.gates_acceptance` means that technical walkthrough also acts as an acceptance gate; keep this rare.
- Use `experience_review.focus_points[]` for operator-facing behaviors that should be tested or felt directly.
- Use `tech_lead_review.focus_points[]` and `tech_lead_review.godot_learning_goals[]` for the concepts, lifecycle callbacks, scene/node anchors, APIs, and extension points the guided walkthrough should cover.
- If neither review checkbox is required, make that absence explicit through both `required = false` switches rather than relying on omission.

## Proof-rigor rules

- Do not leave proof rigor implicit. Every `required_evidence[]` entry must explicitly declare `proof_rigor`.
- `smoke` means cheap sanity only. It may support readiness or debugging, but it may not satisfy a later strict acceptance claim by implication.
- `strict` means full-strength evidence for the claimed behavior or property.
- If the approved completion contract includes operator-visible runtime behavior, `behavior_proof` should normally be `strict`, not `smoke`.
- For strict behavior proof, the written `pass_criterion` should name the adversarial or conflicting interactions, repeated sequences, state churn, and relevant failure-path pressure that the later proof must cover.
- Do not downgrade an operator-visible behavior claim to a smoke-only acceptance plan unless the user explicitly approves that narrower claim upstream.

## Evidence-class rules

- Use `scene_structure_proof` for structural existence, not operator-visible runtime behavior.
- Use `behavior_proof` for operator-visible runtime behavior.
- Use `snapshot_round_trip` only for a round-trip contract that the pass criterion names explicitly.
- Use `data_migration_proof` when preserved migration or upgrade semantics are part of the acceptance contract.
- Do not use `compile`, `code_inspection`, `dispatch_audit`, or `resource_bootstrap_proof` as the sole proof of operator-visible runtime behavior or preserved migration semantics unless upstream planning truth explicitly narrowed the claim that far.

## Migration-proof rules

- If completion includes migration or upgrade semantics, write that claim explicitly into `required_evidence[]` rather than leaving it implied.
- Migration-sensitive `pass_criterion` must say what is preserved and what is intentionally changed.
- If preserved-versus-intentionally-changed semantics are still ambiguous, stop and return upstream instead of guessing a proof mode here.

## Repair-policy rules

- Default repair posture remains `manual_only`.
- Enable same-route delegated delta planning only when approved workflow truth clearly calls for it.
- Same-route delegated delta planning may authorize only bounded delegated `repair-delta-plan`, not scheduler-owned spontaneous replanning.
- Write `repair_policy.mode = manual_only` when the route should surface real `replan_needed` visibly with no hidden delegated delta planning.
- Write `repair_policy.mode = same_route_delegated_delta` only when same-route delegated delta planning is intentionally enabled.
- If enabled, write explicit guards in `repair_policy` so later runtime does not guess:
  - `mode`
  - `same_route_only`
  - `preserve_acceptance_bar`
  - `preserve_proof_rigor`
  - `allow_graph_delta_only`
  - `allow_blueprint_plus_graph_delta`
  - `max_same_route_delta_per_run`
- `manual_only` should carry `allow_graph_delta_only = false`, `allow_blueprint_plus_graph_delta = false`, and `max_same_route_delta_per_run = 0`.
- `same_route_delegated_delta` should keep `same_route_only = true`, `preserve_acceptance_bar = true`, and `preserve_proof_rigor = true`, and it should enable at least one lawful result class.
- Treat `max_same_route_delta_per_run` as the bound for the uninterrupted unattended route lineage; lawful fresh runs after delta do not reset it.
- If enabling same-route delegated delta planning, use `repair_policy.notes[]` to name the intended eligible failure classes and the rollback or visible-replan trigger in plain language.
- Treat same-route delegated delta planning as eligible only when all of the following are expected to hold:
  - repair should stay inside one module
  - repair should stay inside realization ids already present in the approved blueprint/graph neighborhood
  - no new route choice, no new user preference decision, and no taste arbitration should be needed
  - no change to final acceptance expectations, required evidence, or proof rigor should be needed
  - no new workflow step, gate, co-layer exclusion, or runtime-resource rule should be needed
- Do not enable same-route delegated delta planning when likely repair would require new route choice, acceptance-bar change, `proof_rigor` downgrade, or user taste arbitration.

## Do not decide here

- the key use cases and acceptance-sensitive behavior claims; those already belong to `use-case-design`
- the rehearsals, shared route decisions, derived parallelization/convergence, or preplayed route details; those already belong to `execution-blueprint`
- concrete `Atomic Task` structure
- `Red Topo Layer` or `Black Topo Layer` contents
- per-task `model_tier` or `reasoningEffort`
- specific review targets
- concrete runtime slot counts
- whether a user-visible behavior contract may be downgraded to a structure-only contract; that must already be settled before this phase writes planning truth

## Consistency gate

After writing `decision/<module_id>.json`, inspect it directly and confirm it still matches the approved workflow shape, acceptance plan, and decision-gate outcome before treating the write as approved planning truth.

## Output

1. In chat, present the recommended workflow shape, module acceptance plan, required `Decision Gates`, and preserved exclusions.
2. After approval, update the `Decision Handoff`.
3. Check the written decision JSON for consistency before returning success.
