---
name: spike
description: Validate one technical uncertainty with limited scope for a Godot-RUP C# module
compatibility: opencode
---

# Spike (Godot-RUP + C#)

Use this Skill to validate exactly one technical uncertainty or route risk without pretending it is finished feature work.

Canonical references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/TERMS.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-SKILL-SPEC.md`

## Goal

Produce focused evidence for one uncertainty and write that evidence into one planning-stage `Spike Record`.

This Skill exists to reduce uncertainty. It does not approve architecture by itself and it does not silently become production execution.

## Read boundary

Read from:

- `Context Handoff`
- `Decision Handoff`
- the approved spike target or question

## Write boundary

You may write only:

- `spikes/<module_id>/<spike_id>.json`

Do not write:

- `Decision Handoff`
- `Graph Handoff`
- runtime packet artifacts under `runs/<run_id>/packets/`
- runtime session artifacts under `runs/<run_id>/`

## Spike rules

- Validate one question at a time.
- Keep scope intentionally narrow.
- Prefer the smallest proof that resolves the uncertainty.
- Record what was tried, what was observed, and what decision it informs.
- Treat spike output as planning-stage temporary validation only; it does not by itself satisfy final module acceptance.
- If the spike reveals a need to change approved decisions, return that as evidence for a later `Decision Gate`; do not rewrite decisions here.
- If the spike touches code or scenes, keep the work clearly identified as spike material unless the user later promotes it.

## Good spike targets

- viability of a technical route
- runtime/editor behavior that blocks route choice
- interface or data-shape feasibility
- MCP-backed proof for a risky acceptance path
- performance or stability unknowns that affect planning

## Do not

- expand into broad feature implementation
- turn a spike into hidden production work
- silently settle architecture without a user gate
- rewrite the `Atomic Task DAG`

## Output

1. Write concise spike proof into `spikes/<module_id>/<spike_id>.json`.
2. Return a short result with:
   - spike target
   - what was tested
   - what was observed
   - whether it supports the approved route, suggests `rework_needed`, or suggests `replan_needed`
