---
name: accept-module
description: Judge one module dossier and write the authoritative final module acceptance summary. Use only during the separate acceptance stage after execution is already complete.
compatibility: opencode
---

Use only these references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/RUN-SESSION-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/ACCEPTANCE-PROGRAM.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-CONTRACT.md`

Goal:

- judge one module for final acceptance, with required human review only when the approved workflow requires it
- write the authoritative module acceptance summary

Read only:

- `runs/<run_id>/acceptance/<module_id>/dossier.json`
- `decision/<module_id>.json`
- optional `runs/<run_id>/acceptance/<module_id>/human-review-record.json` when `human_review_plan` requires at least one review track
- `graph/<module_id>.json`
- cited authoritative `evidence/<module_id>/<scope_id>/summary.json`

Write only:

- `evidence/<module_id>/module-acceptance/summary.json`

Hard rules:

- run only during the separate acceptance stage after execution reaches `ready_for_acceptance`
- reread `decision/<module_id>.json` and determine the module's `human_review_plan`; if planning truth is ambiguous, fail closed and route back to `workflow-design` instead of guessing
- when any required human review exists, require `runs/<run_id>/acceptance/<module_id>/human-review-record.json`
- when `human_review_plan.experience_review.required = true`, require the recorded experience review to show `performed = true`
- when `human_review_plan.experience_review.gates_acceptance = true`, require the recorded experience-review `gating_verdict = pass` before writing passing acceptance evidence
- when `human_review_plan.tech_lead_review.required = true`, require the recorded tech-lead review to show `performed = true`
- when `human_review_plan.tech_lead_review.gates_acceptance = true`, require the recorded tech-lead-review `gating_verdict = pass` before writing passing acceptance evidence
- when no human review is required, do not demand or invent a human-review artifact
- judge the approved experiential acceptance bar and required evidence against the concrete dossier, any required human-review record when present, and the cited authoritative evidence; do not restate planning intent as if it were proof
- require one acceptance `checklist_results[]` entry per planned `acceptance_plan.required_evidence[]` entry, preserving expected proof type, expected proof rigor, pass criterion, and cited evidence paths
- fail closed if dossier checklist coverage is missing, stale, or mismatched against current decision truth
- do not reopen architecture or execution planning
- do not edit project files except inside a disposable acceptance worktree when the dossier explicitly requires it
- use a disposable acceptance worktree only when the dossier says final proof still requires one
- do not promote runtime state here; `godot-rup-acceptor` promotes only after rereading the acceptance summary
- do not auto-ship
- do not treat user enthusiasm or operator preference alone as sufficient proof when strict evidence is still missing or contradictory
- reject optimistic smoke substitution; smoke evidence may not satisfy a dossier claim that was approved as `strict`
- reject migration-proof substitution; current-state success, compile success, structure checks, or code inspection do not satisfy a preserved migration claim unless the approved pass criterion explicitly narrowed the claim that far
- when any human review was required, include `runs/<run_id>/acceptance/<module_id>/human-review-record.json` in the written summary's `artifacts[]` so the final acceptance record cites the concrete human-review basis it depended on
- include the dossier path in `artifacts[]` so the final acceptance record cites the concrete readback bundle it depended on

Consistency gate:

- reread `evidence/<module_id>/module-acceptance/summary.json` and confirm it uses `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/evidence-summary.schema.json` as current-format acceptance evidence with `kind = acceptance`
- confirm `summary_format = godot_evidence_summary/v4`
- confirm `scope_id = module-acceptance`
- treat the summary as exact passing acceptance evidence only when it records `status = pass`, `outcome = done`, and `completion_quality = exact`
- confirm acceptance-specific fields such as `acceptance_readback`, `checklist_results`, `covered_scope_ids`, `forbidden_simplification_breaches`, and `findings` are present and reflect the concrete dossier rather than generic prose
- confirm `acceptance_readback` cites the concrete decision path, graph path, dossier path, and human-review record path or null exactly as required
- confirm human-review readback fields preserve required/gating booleans truthfully for experience review and tech-lead review
- when any human review was required, confirm `artifacts[]` cites the concrete human-review record path; when no human review was required, confirm no fake human-review dependency was invented
- confirm each checklist result preserves expected proof type, expected proof rigor, pass criterion, and exact cited evidence paths
- confirm checklist results with `result = missing` do not fake evidence paths, and checklist results with `result = pass|fail` do cite concrete evidence paths
- if required proof is still missing or contradictory, write failing or blocked acceptance evidence instead of a misleading pass summary
