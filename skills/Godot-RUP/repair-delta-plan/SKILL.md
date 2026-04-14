---
name: repair-delta-plan
description: Record lawful same-route delegated repair planning for one failing module after execution-side repair proved insufficient
compatibility: opencode
---

# Repair Delta Plan (Godot-RUP + C#)

Use this Skill only for lawful same-route delegated repair planning inside unattended execution.

Canonical references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/TERMS.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/DELTA-RULES.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/PLANNING-ARTIFACT-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/RUNTIME-ARTIFACT-CONTRACT.md`

## Goal

Produce one lawful same-route repair-planning result for one failing module after Level 1 and Level 2 execution-side repair proved insufficient.

This Skill belongs to unattended execution continuity.

It is not a user-approval stop by itself.

## Invocation boundary

Enter this Skill only after runner admission already passed under `DELTA-RULES.md`.

This Skill owns only the finer result-class judgment and planning writes.

## Read boundary

Read from:

- current `Decision Handoff`
- current approved `Execution Blueprint`
- current approved `Graph Handoff`
- relevant archived graph or blueprint revisions only when needed to understand same-route delta history
- current `repair_policy`
- current acceptance evidence requirements and `proof_rigor`
- the failing or insufficient evidence that triggered this repair planning step
- the relevant run-session context that explains why ordinary continuation failed
- counted prior same-route delta attempts for this unattended route

Do not rely on chat recap when current artifacts disagree.

## Write boundary

You may write only planning artifacts.

Allowed writes:

- `graph/<module_id>.json`
- `graph-history/<module_id>/...`
- `blueprint/<module_id>.md`
- `blueprint/<module_id>.json`
- `blueprint-history/<module_id>/...`

You may not write:

- `runs/<run_id>/session.json`
- `runs/<run_id>/modules/<module_id>.json`
- evidence verdicts
- acceptance verdicts
- ship state
- decision route truth

Runtime state updates such as delta count, continue reason, or stop reason remain runner-owned.

## Result-class rule

Follow `DELTA-RULES.md` exactly.

This Skill must return exactly one of:

1. `graph_delta_only`
2. `blueprint_plus_graph_delta`
3. `escalate_visible_replanning`

Do not emit standalone `blueprint_only`.

If the only honest repair shape would require a result class that current `repair_policy` forbids, escalate visibly.

## Required judgments

Before writing any lawful non-escalation result, explicitly judge:

- why Level 1 and Level 2 were insufficient
- why the repair still remains same-route
- why the selected result class is the correct one
- why acceptance bar remains unchanged
- why `proof_rigor` remains unchanged
- whether the counted delta history still looks convergent rather than cyclic
- whether the carried result-class gate permits the chosen output

If any of those judgments fail, escalate visibly.

## Preservation statement

Every lawful non-escalation result must explicitly attest:

- approved use-case truth unchanged
- approved route truth unchanged
- `acceptance_plan.required_evidence[]` unchanged in meaning and strength
- `proof_rigor` unchanged
- module boundary unchanged
- workflow shape not materially redesigned
- carried `repair_policy` preserved or tightened, never widened or dropped

If you cannot attest these honestly, return `escalate_visible_replanning`.

## Output discipline

When returning in chat:

1. state the chosen result class first
2. list the superseded and new revision ids
3. state whether same-route preservation still holds
4. explain briefly why the result is lawful
5. if escalating, explain why visible replanning is required

## Hard bans

- do not ask for extra user approval merely because same-route delegated repair planning is happening
- do not rewrite decision route truth
- do not downgrade `proof_rigor`
- do not weaken acceptance evidence requirements
- do not treat every invocation as a fresh first attempt when delta history says otherwise
- do not write runtime state directly
- do not widen, drop, or silently rewrite the carried `repair_policy` while writing a superseding graph
