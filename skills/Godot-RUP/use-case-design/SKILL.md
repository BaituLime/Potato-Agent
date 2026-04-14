---
name: use-case-design
description: Define and record the approved operator-facing use-case contract for one Godot-RUP C# module
compatibility: opencode
---

# Use-Case Design (Godot-RUP + C#)

Use this Skill to define what operator-visible scenarios, success conditions, and acceptance-sensitive behavior claims a module must satisfy before technical route selection begins.

Canonical references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/TERMS.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-SKILL-SPEC.md`

## Goal

Produce a recommendation first, then write the approved use-case design only after the user passes the required `DG-USE-CASE-*` gate.

This phase defines what the module must let the operator do, see, or experience. It is repo-aware, but it does not choose the technical route.

## Read boundary

Read from:

- `Context Handoff`
- user goal and scope discussion
- relevant project docs, UX references, and product intent
- only enough repo truth to stay honest about platform or project constraints

## Write boundary

You may write only:

- `use-cases/<module_id>.md`
- `use-cases/<module_id>.json`
- `use-cases-history/<module_id>/<use_case_design_revision_id>.md`
- `use-cases-history/<module_id>/<use_case_design_revision_id>.json`

`use-cases/<module_id>.md` is the authoritative artifact.

`use-cases/<module_id>.json` is a thin companion index only.

Only write these after explicit user approval.

- If this use-case design supersedes an earlier approved revision, archive the prior markdown and json revision under `use-cases-history/<module_id>/<use_case_design_revision_id>.*` before replacing the latest alias.
- Do not silently discard an earlier approved use-case-design revision.

## Required drafting order

Present recommendations in this order:

1. `Key Use Cases`
2. `Acceptance-Sensitive Behavior Claims`
3. `Out Of Scope`
4. `Open Questions`

## Key use-case standard

Each key use case must stay operator-facing and implementation-neutral.

Each one should make clear, in prose:

- operator intent
- success experience
- relevant edge or failure pressure
- what later acceptance must be able to prove as real behavior

Use enough repo awareness to avoid fantasy scope, but do not collapse into architecture or implementation route selection here.

## Hard rules

- This phase owns what the module must achieve, not how the repo should implement it.
- Do not choose classes, scenes, seams, authority anchors, technical route options, or task structure here.
- Do not define workflow steps, proof packets, or DAG slices.
- Do not let implementation convenience silently narrow the operator-visible contract.
- If a proposed use case can only be described by assuming one technical route over another, keep the user-facing contract and mark the route pressure as an open question for `architecture-review`.
- If the key-use-case set itself is still ambiguous, stop here and resolve it before technical route approval proceeds.

## Consistency gate

After writing the artifacts:

- inspect `use-cases/<module_id>.md` directly and confirm it is the authoritative operator-facing contract
- inspect `use-cases/<module_id>.json` directly and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/use-case-design.schema.json`
- confirm the json is only a thin companion index for the markdown, not a competing narrative

## Output

1. In chat, present the proposed key use cases first.
2. Then present the acceptance-sensitive behavior claims, out-of-scope boundary, and open questions.
3. Call out the required `DG-USE-CASE-*` gate.
4. After approval, write the authoritative markdown plus thin companion json and archive any superseded revision.
5. Recheck the written artifacts before returning success.
