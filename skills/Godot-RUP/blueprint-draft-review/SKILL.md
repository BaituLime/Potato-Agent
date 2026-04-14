---
title: Godot-RUP blueprint draft review
status: active-rebuild
language: C#
---

# Godot-RUP Blueprint Draft Review

Treat this skill as the strict artifact review pass for one blueprint draft.

This is not a happy-path check.

This skill does not revise the draft.

It reads one draft artifact set, performs strict findings-first review, writes one temporary review file, and returns only the review file path, findings count, and review verdict.

This skill is intended to run in a fresh child review context launched from the main planning chat.

Use a fresh child context.

Do not resume a prior child review session for ordinary draft review.

## Canonical references

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/TERMS.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-SKILL-SPEC.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/BLUEPRINT-REHEARSAL-TEMPLATE-V2.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/BLUEPRINT-REVIEW-RUBRIC.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/BLUEPRINT-GAP-ANALYSIS-V2.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/BLUEPRINT-REVIEW-GATE-V2.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/BLUEPRINT-EXAMPLE-GOOD.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/BLUEPRINT-EXAMPLE-BAD.md`

## Required inputs

Resolve exactly one blueprint draft markdown path from the explicit request.

That draft must be:

- `blueprint/<module_id>.draft.md`

Then read all of the following:

- the matching `blueprint/<module_id>.draft.json`
- the matching approved `use-cases/<module_id>.md`
- the matching approved `decision/<module_id>.md`
- any repo surfaces needed to verify decisive route claims in the draft

If a required peer artifact is missing, treat that as a review finding and continue by writing the temporary review file.

## Write boundary

You may write exactly one non-authoritative temporary review file at:

- `/tmp/godot-rup-blueprint-review/<module_id>.md`

You may overwrite a prior file at that same temporary path.

You may not edit any handoff artifact.

You may not edit the blueprint draft.

## Review posture

Review strictly.

Findings come first.

Prefer decisive route gaps over broad style commentary.

Call out any case where the draft is really one of these false-preplay shapes:

- a process or flow specification sheet
- a simulated player journey
- a requirements or order bundle

Also review for decisive route closure, especially:

- first implementer move
- first route cut
- entry contract
- ownership boundary
- candidate-versus-live route
- swap and rebind order
- first safe live-runtime touch point
- object or seam handoff clarity

## Temporary review file shape

Write the file in English using this order:

1. `Target`
2. `Findings`
3. `Gate Judgment`
4. `Residual Risk`

Each finding should:

- be concrete
- cite file and line references when possible
- focus on bugs, route gaps, ownership gaps, fake-preplay shape, or gate-blocking ambiguity

If there are no findings, say so explicitly.

## Verdict classes

Use exactly one verdict:

- `ready_for_blueprint_gate`
- `revise_blueprint_locally`
- `return_to_architecture_review`
- `recommend_spike`

## Final response

Return only:

- `review_file: <path>`
- `findings: <count>`
- `verdict: <verdict>`
