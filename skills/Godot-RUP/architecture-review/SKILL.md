---
name: architecture-review
description: Propose and record the approved technical route for one Godot-RUP C# module
compatibility: opencode
---

# Architecture Review (Godot-RUP + C#)

Use this Skill to turn approved use-case design plus discovered project facts into an approved technical route for one Module.

Canonical references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/TERMS.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-SKILL-SPEC.md`

## Goal

Produce a recommendation first, then write the approved result into the `Decision Handoff` only after the user passes the required `Decision Gate`.

## Read boundary

Read from:

- `Context Handoff`
- approved `Use-Case Design`
- relevant project docs and architecture references

## Write boundary

You may write only:

- `Decision Handoff`

Only write it after explicit user approval.

## Required review content

Present architecture recommendations in chat before writing approved decisions.

Before reusing existing handoff wording or structure, reread the canonical common workflow docs. Older handoff artifacts may supply project context, but they may not override active workflow rules or machine shapes.

Include:

- route options when more than one credible route exists
- the recommended route and why it is preferred
- how the route satisfies the approved key use cases and acceptance-sensitive behavior claims
- any route pressure or mismatch that should force a return to `use-case-design` instead of being silently normalized here
- interface conventions and key coding constraints
- must-preserve behavior, data, and integration rules
- forbidden simplifications and debt-heavy shortcuts
- open risks, unknowns, and places where a Spike is recommended
- acceptance-sensitive details that execution may not reinterpret later
- the proof boundary between structure and behavior when that distinction matters
- final integrated behavior that later module acceptance must judge as pass/fail truth

## Decision posture

- The user owns the final technical route.
- You may recommend, compare, and challenge bad assumptions.
- You may not silently decide on behalf of the user when the route materially affects architecture, data authority, or future debt.
- Do not silently redefine the approved key use cases or their operator-visible success semantics here.
- If the approved use-case design is still ambiguous or route-incompatible, stop and return upstream instead of laundering that ambiguity into architecture prose.
- If uncertainty is too high, recommend a `Spike` instead of pretending the route is settled.

## Consistency gate

After writing `decision/<module_id>.json`, inspect it directly and confirm it still matches the approved `Use-Case Design`, the user-approved route, the carried-forward done definition, the experiential acceptance bar, and the decision-gate outcome before treating the route as approved.

## Do not

- split Atomic Tasks
- define or redefine key use cases; that belongs to `use-case-design`
- redefine operator-facing done semantics or experiential acceptance bar; carry them forward from the approved `Use-Case Design` unless the user explicitly regates that upstream truth
- pre-split use-case realizations, task buckets, or task-local execution preflights; that belongs to `execution-blueprint`
- assign per-task `model_tier` or `reasoningEffort`
- choose review targets
- set runtime slot counts
- mutate execution truth without a user `Decision Gate`

## Output

1. In chat, provide the recommendation set and call out the required `Decision Gate`.
2. In that gate, make any route-vs-use-case mismatch explicit enough that later steps cannot pretend it was already resolved.
3. After approval, update the `Decision Handoff` with the approved route, rationale, constraints, carried-forward acceptance expectations, open risks, and the source `Use-Case Design` reference.
4. Check the written decision JSON for consistency before returning success.
