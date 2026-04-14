---
title: Godot-RUP acceptance hard program
status: draft-rebuild
language: C#
---

# Godot-RUP Acceptance Hard Program

Acceptance is one explicit user-invoked stage after execution reaches `ready_for_acceptance`.

That stage always includes final module acceptance and may also include required human review first when planning truth activated it for the module.

Acceptance is an explicit readback stage, not execution momentum plus a summary sentence.

## 1. Entry sequence

`godot-rup-acceptor` may do only this:

1. resolve active handoff root, target `run_id`, and target modules
2. confirm each requested module is either `ready_for_acceptance` or already `accepted`
3. reread `decision/<module_id>.json` and extract `acceptance_plan.human_review_plan`; if that planning truth is missing or ambiguous, stop and route back to `workflow-design`
4. for each requested module still at `ready_for_acceptance`, call `assemble-acceptance-dossier`
5. only when `human_review_plan` requires at least one review track, call `prepare-user-review-brief`
6. only when `human_review_plan` requires at least one review track, present the human review brief and collect explicit user review results
7. only when `human_review_plan` requires at least one review track, call `record-user-review-gate`
8. only when no human review is required, or when the recorded human-review record exists and every acceptance-gating review inside it says `pass`, call `accept-module`
9. after rereading and validating the written module acceptance summary, promote the module to `accepted` only when that summary is current-format exact passing acceptance evidence and any required acceptance-gating human review still says `pass`
10. only on a later explicit ship gate inside the same `godot-rup-acceptor` flow, call `integrate-main` and then `cleanup-worktrees`

It may not infer human-review completion, human-review pass, or ship approval from stale chat prose.

## 2. Dossier assembly

`assemble-acceptance-dossier`

- collects `decision/<module_id>.json`
- collects `graph/<module_id>.json`
- collects integrated runtime state from `runs/<run_id>/modules/<module_id>.json`
- collects relevant `runs/<run_id>/settlements/<module_id>/<layer_id>.json` and `runs/<run_id>/integrations/<module_id>/<layer_id>.json`
- collects cited authoritative `evidence/<module_id>/<scope_id>/summary.json` outputs already produced during execution
- planning-stage spike records may inform route history, but they do not count as final acceptance evidence by themselves
- dossier readers must preserve the approved `proof_rigor` for each required evidence claim; smoke evidence may not be silently upgraded during acceptance
- dossier assembly must produce one checklist input per planned `acceptance_plan.required_evidence[]` entry, preserving proof type, proof rigor, pass criterion, and explicit evidence collection status
- missing evidence must remain visible in the dossier rather than disappearing by omission

It writes only the acceptance dossier.

It does not judge pass or fail.

## 2.1 Evidence matrix

Acceptance must judge the right evidence class for the right claim.

- `compile` proves buildability or wiring sanity only
- `resource_bootstrap_proof` proves harness or environment readiness only
- `dispatch_audit` proves dispatch integrity only
- `scene_structure_proof` proves structure only
- `code_inspection` proves static implementation facts only unless planning truth explicitly narrowed the claim that far
- `behavior_proof` proves operator-visible runtime behavior
- `headless` may support behavior or migration claims only when the pass criterion says so explicitly
- `snapshot_round_trip` proves only the round-trip contract named by the pass criterion
- `data_migration_proof` proves preserved or intentionally changed migration semantics named by the pass criterion

Acceptance must not substitute one evidence class for another merely because the artifact exists.

## 2.2 Migration proof rules

Migration-sensitive claims require explicit preserved-versus-intentionally-changed semantics.

- if a claim depends on migration or upgrade preservation, the planned `pass_criterion` must say what is preserved and what is intentionally changed
- `compile`, `code_inspection`, `scene_structure_proof`, `dispatch_audit`, and `resource_bootstrap_proof` are never sufficient by themselves for preserved migration semantics
- acceptance must fail closed when migration semantics are ambiguous

## 3. Human review brief

`prepare-user-review-brief`

- exists only when `human_review_plan.experience_review.required` or `human_review_plan.tech_lead_review.required`
- reads `runs/<run_id>/acceptance/<module_id>/dossier.json`
- reads `decision/<module_id>.json` and `graph/<module_id>.json`
- may reread cited authoritative evidence and only the smallest necessary project files needed to explain testing or implementation hotspots
- writes `runs/<run_id>/acceptance/<module_id>/human-review-brief.json`
- produces a concise guided-review guide with operator try-it flow, scope boundaries, implementation map, Godot scene/node anchors, Godot lifecycle map, extension points, and evidence map
- evidence maps should preserve proof rigor and pass-criterion context for each cited acceptance claim so human review can see which signals are strict versus sanity-only
- when tech-lead review is required, the brief should make the module teachable: how it plugs into Godot, which callbacks matter, how state flows, and where future extension starts
- should minimize rehydration cost by preferring dossier truth over broad repository rereads

It does not judge final acceptance.

## 4. Human review record

`record-user-review-gate`

- exists only when `human_review_plan` requires at least one review track
- reads `runs/<run_id>/acceptance/<module_id>/human-review-brief.json`
- reads the explicit user review results from the current `godot-rup-acceptor` flow
- writes `runs/<run_id>/acceptance/<module_id>/human-review-record.json`
- records experience-review results and tech-lead-review results separately
- any review track that gates acceptance must record one explicit gating verdict as `pass`, `fail`, `more_checks`, or `hold`
- a non-gating review track may still record useful understanding status, notes, and follow-up questions without acting as a pass/fail gate

It does not judge proof sufficiency and may not ship.

## 5. Final module acceptance

`accept-module`

- reads `runs/<run_id>/acceptance/<module_id>/dossier.json`
- reads `decision/<module_id>.json`
- reads `runs/<run_id>/acceptance/<module_id>/human-review-record.json` only when `human_review_plan` requires at least one review track
- runs only the final acceptance work that still belongs to acceptance
- writes the authoritative module acceptance summary

`godot-rup-acceptor` must reread the concrete written acceptance summary and confirm it matches the dossier, any required human-review record, and the cited authoritative evidence before promoting module state.

Acceptance summary readback must preserve:

- the exact decision path
- the exact graph path
- the exact dossier path
- the exact human-review record path when any review was required
- whether experience review was required
- whether experience review gated acceptance
- the exact experience-review gating verdict when gating was active
- whether tech-lead review was required
- whether tech-lead review gated acceptance
- the exact tech-lead review gating verdict when gating was active
- the recorded tech-lead understanding status when tech-lead review was required
- one checklist result per planned `required_evidence[]` entry with exact cited evidence paths

Current-format exact passing acceptance evidence means the written summary is in the active evidence-summary shape with:

- `scope_id = module-acceptance`
- `kind = acceptance`
- `status = pass`
- `outcome = done`
- `completion_quality = exact`
- exact acceptance readback fields

Acceptance summaries should also carry concrete checklist judgment fields so later promotion is based on exact written evidence rather than chat prose.

When human review was required, passing acceptance summaries should also cite the concrete human-review record artifact in `artifacts[]`.

Acceptance must reject optimistic smoke substitution.

- If the approved acceptance plan marked an evidence claim `strict`, smoke or happy-path-only evidence is insufficient even when it superficially demonstrates the feature once.
- For operator-visible behavior, strict proof should normally demonstrate adversarial or conflicting interactions, repeated sequences, state churn, and relevant failure-path pressure rather than only a single success path.
- If the approved acceptance plan marked a migration-sensitive claim through `data_migration_proof` or a migration-shaped `snapshot_round_trip`, current-state success alone is insufficient unless the pass criterion explicitly narrowed the claim that way.

Acceptance must also reject fake human-review completion.

- if `human_review_plan` required a review track, acceptance must not infer that it happened from transient chat or operator enthusiasm
- if a review track gated acceptance, only an explicit recorded `pass` for that track may unlock passing final acceptance
- if a required tech-lead review was performed but did not gate acceptance, its recorded understanding result may still inform notes and follow-up without being rewritten into a fake pass gate

If final proof still needs isolation, `accept-module` owns creating and cleaning any disposable acceptance checkout locally; acceptance does not allocate or track a shared acceptance slot.

It may use a disposable acceptance worktree only when the dossier says final proof still requires one.

It may not silently reopen architecture or execution planning.

## 6. Optional ship phase inside acceptance

- shipping is still a distinct authority boundary, but it is now launched by an explicit later gate inside `godot-rup-acceptor` rather than by a separate user command
- only explicit user approval may authorize shipping
- only `integrate-main` may move a module from `accepted` to `done`
- after each successful ship, `godot-rup-acceptor` should run `cleanup-worktrees` for that same module
- if the ship gate is held, the module remains `accepted` rather than `done`

Pilot judgment remains separate from this per-module ship flow.

`Keep`, `Fix`, and `Rollback` are workflow-level meta verdicts over real pilot outcomes; they do not replace module acceptance or ship truth.
