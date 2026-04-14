---
name: prepare-user-review-brief
description: Compile one human-review guide from the acceptance dossier, approved scope, and the smallest necessary implementation context.
compatibility: opencode
---

Use only these references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/TERMS.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/ACCEPTANCE-PROGRAM.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-CONTRACT.md`

Goal:

- write one human-review brief

Read only:

- `decision/<module_id>.json`
- `runs/<run_id>/acceptance/<module_id>/dossier.json`
- `graph/<module_id>.json`
- cited authoritative `evidence/<module_id>/<scope_id>/summary.json`
- only the smallest necessary project files needed to explain manual testing or key implementation hotspots

Write only:

- `runs/<run_id>/acceptance/<module_id>/human-review-brief.json`

Hard rules:

- this legacy-named skill now produces the active human-review brief artifact
- use this skill only when `human_review_plan` requires at least one review track
- produce a concise guided-review brief that reduces rehydration cost for human review
- prefer dossier, decision, graph, and cited evidence over broad repository rereads
- include concrete fields for `human_review_plan`, `what_to_try`, `quick_test_script`, `success_signals`, `failure_signals`, `scope_boundaries`, `implementation_map`, `scene_anchor_map`, `godot_lifecycle_map`, `extension_points`, `evidence_map`, `open_questions`, and `notes`
- for each `evidence_map` entry, preserve `proof_rigor` and `pass_criterion` so human review can see which signals are strict versus sanity-only
- keep `implementation_map`, `scene_anchor_map`, and `godot_lifecycle_map` to the smallest useful set; do not turn this into a full repo tour
- when tech-lead review is required, make the brief actually teachable: show key Godot callbacks, scene/node anchors, extension points, and where future changes should begin
- tell the user how to test and understand the module; do not write a final acceptance verdict here
- do not edit project files or runtime state

Consistency gate:

- reread `runs/<run_id>/acceptance/<module_id>/human-review-brief.json` and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/human-review-brief.schema.json`
- confirm the brief stays concise, review-oriented, and grounded in concrete dossier or evidence paths rather than generic prose
