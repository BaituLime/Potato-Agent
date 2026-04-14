---
name: execution-blueprint
description: Rehearse approved use-case realization routes after use-case and architecture approval
compatibility: opencode
---

# Execution Blueprint (Godot-RUP + C#)

Use this Skill to rehearse how one approved module should actually be implemented in current repo reality after use-case design and architecture route approval, before workflow design and DAG planning.

Canonical references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/TERMS.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-SKILL-SPEC.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/BLUEPRINT-REVIEW-RUBRIC.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/BLUEPRINT-GAP-ANALYSIS-V2.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/BLUEPRINT-REVIEW-GATE-V2.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/BLUEPRINT-REHEARSAL-TEMPLATE-V2.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/BLUEPRINT-EXAMPLE-GOOD.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/BLUEPRINT-EXAMPLE-BAD.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/BLUEPRINT-EXAMPLE-NOTES.md`

## Goal

Produce a recommendation first, then write the approved execution blueprint only after the user passes the required `DG-BLUEPRINT-*` gate.

This phase should use the strongest available reasoning to think through how the module should actually be implemented, so later DAG planning and weaker execution models inherit pre-decided implementation truth instead of improvising it.

The point is not to pre-cut tasks, define MVP slices, or optimize token spend. The point is to rehearse the implementation through the module's already-approved operator-facing use cases so downstream planning no longer has to invent the hard route.

Use this concrete drafting test throughout the phase:

"If I had to start modifying this repo tomorrow, where would I cut first, how would code and state actually flow, and which objects or seams would hand work to each other?"

If the draft cannot answer that clearly, it is not ready for blueprint gate discussion.

## Thinking posture

- Reread the canonical common workflow docs before inheriting planning habits from existing handoff artifacts.
- In this phase, do not optimize for brevity, response length, or token conservation.
- Treat the repo as fully available. Read as much relevant implementation context as needed.
- The user should not need to hand-feed a file list.
- Prefer a longer, clearer, repo-grounded rehearsal over a shorter tidy outline.
- Treat existing handoff artifacts as current project context only when they remain contract-consistent; do not let stale handoff shape redefine blueprint structure or workflow semantics.
- Do not trust the first coherent draft. Red-team it internally, repair it, and only then decide whether it is strong enough to surface `DG-BLUEPRINT-*`.
- Before writing the first sentence of the blueprint, read the repo surfaces most likely to change the implementation route.
- Write as if you are handing the route to a weaker but obedient implementer who should not have to rediscover the traps for themselves.
- Write as a technical operator preplaying the implementation route, not as a planner decomposing one large order into smaller orders.
- Do not let the concise Chinese recommendation summary become a substitute for a full blueprint-grade draft. Before any gate verdict, the hardest rehearsals should already exist internally at full artifact quality in English prose.

## Read boundary

Read from:

- `Context Handoff`
- approved `Use-Case Design`
- current `Decision Handoff`
- module-specific architecture references and approved constraints
- whatever repo implementation surfaces are needed to rehearse the actual implementation route
- the latest user direction for this Module or Ring Iteration

Read enough repo truth to ground the rehearsal. Do not stop at planning summaries when the route depends on real runtime ownership, scene composition, state flow, input grammar, persistence, layering, or UI orchestration details.

## Write boundary

You may write only:

- `blueprint/<module_id>.draft.md`
- `blueprint/<module_id>.draft.json`
- `blueprint/<module_id>.md`
- `blueprint/<module_id>.json`
- `blueprint-history/<module_id>/<blueprint_revision_id>.md`
- `blueprint-history/<module_id>/<blueprint_revision_id>.json`

`blueprint/<module_id>.draft.md` is the required pre-approval draft artifact.

It must be written fully in English.

It is not authoritative planning truth.

`blueprint/<module_id>.draft.json` is the matching pre-approval draft index.

It is not authoritative planning truth.

`blueprint/<module_id>.md` is the authoritative blueprint artifact.

The authoritative markdown must be written fully in English.

`blueprint/<module_id>.json` is a thin companion index for downstream referencing only. It may not become the primary narrative or decision surface.

When discussing recommendations with the user in chat, summarize in concise Chinese unless the user explicitly asks for another language.

## Artifact-first rule

Before any gate verdict or user-facing discussion summary, draft the route in full English prose inside `blueprint/<module_id>.draft.md`.

The Chinese discussion summary is a lossy derivative of that draft file.

It is not the scaffold the blueprint should be written from.

Do not let recommendation bullets, verdict bullets, or review-summary shape become the skeleton of blueprint thinking.

If the hardest route step exists only in summary form and not yet in `blueprint/<module_id>.draft.md`, the blueprint is not ready.

Pre-approval work must write only the `*.draft.*` pair.

After explicit user approval:

- if this blueprint supersedes an earlier approved blueprint, archive the prior markdown and json revision under `blueprint-history/<module_id>/<blueprint_revision_id>.*` before replacing the latest alias
- promote `blueprint/<module_id>.draft.md` to `blueprint/<module_id>.md`
- promote `blueprint/<module_id>.draft.json` to `blueprint/<module_id>.json`
- remove the `*.draft.*` pair after promotion so draft and approved aliases do not coexist as competing current truths
- do not silently discard an earlier approved blueprint revision

Before any gate verdict, launch one fresh child review and run `/godot-rup-review-blueprint-draft blueprint/<module_id>.draft.md` there.

## Authoritative artifact shape

The authoritative markdown should be structured in this order:

1. `Implementation Route`
2. `Coverage Against Approved Use Cases`
3. `Shared Route Decisions`
4. `Derived Parallelization And Convergence`
5. `Out Of Scope`
6. `Open Questions`

Do not restate the approved use-case design as a main section here. Use it as the input contract that the route must satisfy.

Do not open with `MVP spine`, `Trunk`, `Support Branch`, `Subsystem`, `Forest`, `Key Use Cases`, or any other top-down planning or FAQ-like summary structure.

The main body should be route-first. The implementation conclusion should follow the order in which a real implementer would cut the repo.

## Route rehearsal standard

Every approved key use case must be clearly covered in the authoritative markdown.

But the main rehearsal body should be organized by decisive route steps, not by one section per use case.

Each decisive route step must read like a technical operator preplay rather than a specification list.

Each rehearsal must make all of the following clear in prose:

- current-code friction
- where a real implementer would start reading or cutting in the repo
- the first route cut that makes the rest safe
- what the route looks like after that cut
- the tempting wrong route and why it is wrong
- what must remain true during implementation
- repo grounding

For modules that establish a new root host, session boundary, composite snapshot boundary, or other root composition route, each decisive rehearsal must also make explicit:

- who bootstraps that boundary
- when candidate state exists before becoming live
- the swap and rebind order
- when live runtime or scene objects may first be touched safely

If the repo is missing the module's primary entry contract, the rehearsal must choose the first honest repo-local route for that contract instead of leaving it as a decorative later detail.

For boundary-heavy modules, do not stop after naming the new host, root, bridge, or contract. At least one decisive rehearsal should walk the actual route through query or selection, candidate construction, first safe live touch, bind or restore, commit, and teardown order.

Use `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/BLUEPRINT-REHEARSAL-TEMPLATE-V2.md` as the default drafting pattern.

Do not flatten this into a table, checklist, or long bullet-only spec sheet. Use headings and prose so the rehearsal remains legible and concrete rather than exam-shaped.

Principle-level warning:

- do not mistake a process specification sheet for implementation preplay
- do not mistake a simulated player journey for implementation preplay
- do not mistake a requirements or order bundle for implementation preplay

Within each route step, put `Current-Code Friction` first. Make the route answer the code reality, not the other way around.

Within each route step, the first implementer move must become visible. A weaker downstream implementer should not need to guess where to start or what to cut first.

Within each route step, the tempting wrong route is mandatory. Name the most plausible wrong route, because that is usually what a weaker downstream implementer would otherwise choose.

Do not force equal length, equal symmetry, or equal detail across route steps. Let the hard steps run long and let the easy ones stay short.

Do not add, remove, merge, or split approved key use cases here. If the approved set is wrong, return upstream to `use-case-design` instead of silently repairing it inside the blueprint.

Keep approved-use-case coverage explicit, but brief. The route body should not collapse into a restated use-case list.

## Derived sections

`Shared Route Decisions` should appear only after the rehearsals make the common route obvious.

`Derived Parallelization And Convergence` is a consequence of the rehearsals. Do not force a decorative forest or parallel map just because the document wants one.

If the module is mostly one route with little safe parallelism, write that truth plainly.

## Hard reject rules

Do not surface `DG-BLUEPRINT-*` yet if any of these are true:

- the structure starts from capability buckets, lanes, subsystems, engineering workstreams, or decorative branches
- `MVP spine` appears as a top-level planning summary in this phase
- `Key Use Cases` appears as a main blueprint body section rather than remaining upstream input truth plus downstream coverage check
- a supposed use case is really just a capability label
- the blueprint silently adds, removes, merges, or splits approved key use cases instead of returning upstream
- the draft still reads like a tidy design outline, specification sheet, or decomposed composite order instead of an implementation rehearsal
- the draft is really a process or flow specification sheet wearing blueprint headings
- the draft is really a simulated player journey wearing blueprint headings
- the draft is really a requirements or order bundle wearing blueprint headings
- the draft marches through approved use cases one by one in a FAQ-like way even though the decisive implementation route clearly cuts across several of them
- a rehearsal states the desired end-state before explaining what current repo reality is pushing against
- a rehearsal has no concrete tempting wrong route, so the downstream trap remains implicit
- a rehearsal never makes the first route cut explicit, so the implementer still has to invent where to start
- the module establishes a new root boundary, but the draft still leaves bootstrap, candidate, swap, or rebind timing implicit
- the draft leaves the module's primary entry contract as an `Open Question` even though that choice changes the first route cut or where implementation starts
- an `Open Question` would still change root ownership, candidate-vs-live boundary, or the first safe live-runtime touch point
- key state or authority truth is still implicit
- alternate or failure handling is still hand-wavy where behavior would materially differ
- repo grounding is only a final reading list instead of being attached to the judgments it supports
- derived parallelism is decorative or unjustified
- the draft has already started pre-cutting tasks, packet context, proof scopes, or dispatch choices

If any hard reject rule fires, revise first. Do not ask for approval yet.

## Do not

- define MVP slices or task decomposition
- write or rewrite `Use-Case Design`
- define workflow steps or acceptance gates
- choose review targets
- assign per-task `model_tier` or `reasoningEffort`
- produce packet-style `must_read` or dispatch-context lists
- add a self-justifying `Why This Passes` section
- stage a separate reviewer persona, second assistant, or two-turn review theater
- write `Decision Handoff`
- write `Graph Handoff`

## Consistency gate

Before asking for `DG-BLUEPRINT-*`, reread `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/BLUEPRINT-REVIEW-RUBRIC.md` and silently self-check the draft against it.

Also run an internal blueprint gap analysis using `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/BLUEPRINT-GAP-ANALYSIS-V2.md` and decide one gate verdict using `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/BLUEPRINT-REVIEW-GATE-V2.md`.

Do not decide gate readiness from summary notes alone. The gate verdict must be based on a full rehearsal-grade draft, even before the approved artifact is written to disk.

Do not surface a `ready_for_blueprint_gate` verdict until a fresh child review returns `ready_for_blueprint_gate` on `/godot-rup-review-blueprint-draft blueprint/<module_id>.draft.md` for the current draft.

After writing the blueprint artifacts:

- inspect `blueprint/<module_id>.draft.md` directly and confirm the hard route exists there at artifact quality before user-facing summary
- inspect the temporary review file returned by `/godot-rup-review-blueprint-draft` directly and repair the draft if findings remain
- inspect `blueprint/<module_id>.md` directly and confirm it is the authoritative narrative truth
- inspect `blueprint/<module_id>.json` directly and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/execution-blueprint.schema.json`
- confirm the json is only a thin reference index for the markdown, not a second competing narrative
- confirm the json points back to the approved `Use-Case Design` and `Decision Handoff`
- confirm every downstream `realization_id` referenced in the json actually exists as a stable implementation-route or derived convergence anchor in the markdown

## Discussion summary shape

In chat, do not mirror the authoritative markdown section headings.

The Chinese summary should usually include only:

1. the implementation route in repo-cut order
2. the decisive remaining gaps, if any
3. the review-gate verdict

Coverage against approved use-case design or other derived sections may be mentioned briefly only when they materially affect the verdict.

Do not produce a second blueprint outline in chat.

## Output

1. Write `blueprint/<module_id>.draft.md` and `blueprint/<module_id>.draft.json` first.
2. Launch a fresh child review and run `/godot-rup-review-blueprint-draft blueprint/<module_id>.draft.md` there.
3. Reread the temporary review file, repair the draft if findings remain, and rerun review as needed.
4. In chat, summarize the route in concise Chinese without mirroring the artifact headings.
5. Then give a concise Chinese blueprint gap analysis.
6. Then state one review-gate verdict: `ready_for_blueprint_gate`, `revise_blueprint_locally`, `return_to_architecture_review`, or `recommend_spike`.
7. Only if the verdict is `ready_for_blueprint_gate`, call out the required `DG-BLUEPRINT-*` gate.
8. After approval, promote the `*.draft.*` pair into the authoritative markdown plus thin companion json, including the source `Use-Case Design` reference, and archive any superseded revision.
9. Recheck the written artifacts before returning success.
