---
name: assemble-acceptance-dossier
description: Assemble one module acceptance dossier from approved contracts, integrated runtime state, and authoritative execution evidence. Use before final module acceptance.
compatibility: opencode
---

Use only these references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/RUN-SESSION-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/ACCEPTANCE-PROGRAM.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-CONTRACT.md`

Goal:

- write one acceptance dossier

Read only:

- `decision/<module_id>.json`
- `graph/<module_id>.json`
- `runs/<run_id>/modules/<module_id>.json`
- relevant `runs/<run_id>/settlements/<module_id>/<layer_id>.json`
- relevant `runs/<run_id>/integrations/<module_id>/<layer_id>.json`
- cited authoritative `evidence/<module_id>/<scope_id>/summary.json`

Write only:

- `runs/<run_id>/acceptance/<module_id>/dossier.json`

Hard rules:

- collect exact evidence references; do not judge pass or fail here
- collect the approved decision, approved graph, integrated module state, and cited authoritative evidence as concrete dossier inputs
- emit concrete path references for the module session, relevant settlements, relevant integrations, and cited authoritative evidence; do not rely on scope ids alone when an exact path is available
- emit one dossier `checklist_inputs[]` entry per planned `acceptance_plan.required_evidence[]` entry, preserving expected proof type, expected proof rigor, and pass criterion from planning truth
- carry the current `acceptance_plan.human_review_plan` into the dossier so later human-review and acceptance steps do not guess from chat memory
- if no concrete authoritative evidence was found for a required evidence claim, mark that checklist input explicitly as missing instead of omitting it
- do not edit project files
- do not rewrite execution evidence
- use the current OpenCode task context to resolve the active run and module paths; do not guess missing roots

Consistency gate:

- reread `runs/<run_id>/acceptance/<module_id>/dossier.json` and confirm it remains a collected acceptance bundle rather than a hidden acceptance verdict
- confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/acceptance-dossier.schema.json`
- confirm the dossier cites concrete authoritative evidence paths and does not invent missing proof
