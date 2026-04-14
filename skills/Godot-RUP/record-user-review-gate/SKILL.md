---
name: record-user-review-gate
description: Record one explicit human-review result inside the acceptance workflow.
compatibility: opencode
---

Use only these references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/TERMS.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/ACCEPTANCE-PROGRAM.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-CONTRACT.md`

Goal:

- write one human-review record

Read only:

- `decision/<module_id>.json`
- `runs/<run_id>/acceptance/<module_id>/human-review-brief.json`
- the explicit user review outputs from the current `godot-rup-acceptor` flow

Write only:

- `runs/<run_id>/acceptance/<module_id>/human-review-record.json`

Hard rules:

- this legacy-named skill now writes the active human-review record artifact
- use this skill only when `human_review_plan` requires at least one review track
- record experience-review and tech-lead-review results separately
- for any acceptance-gating review track, preserve the exact explicit gating verdict as one of `pass`, `fail`, `more_checks`, or `hold`
- for tech-lead review, preserve the user's understanding status and remaining questions instead of collapsing everything into a pass/fail gate
- do not invent approval, checked items, operator notes, learned topics, or follow-up questions that the user did not actually provide
- if the user provides no notes, checked items, learned topics, or follow-up questions, leave those arrays empty rather than fabricating detail
- preserve the exact brief path so later acceptance readback can cite the concrete human-review basis
- do not promote module state, write acceptance evidence, or ship here
- preserve the human-review result as concrete workflow truth so later acceptance does not rely on transient chat memory

Consistency gate:

- reread `runs/<run_id>/acceptance/<module_id>/human-review-record.json` and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/human-review-record.schema.json`
- confirm every written gating verdict or understanding field matches the user's explicit review result exactly
