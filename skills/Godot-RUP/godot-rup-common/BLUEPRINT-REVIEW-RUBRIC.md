# Execution Blueprint Self-Check

Use this rubric internally while drafting the execution blueprint.

Do not turn it into a separate reviewer persona, a second conversation, or a user-facing `Why This Passes` section.

Pair this self-check with:

- `BLUEPRINT-REHEARSAL-TEMPLATE-V2.md`
- `BLUEPRINT-EXAMPLE-GOOD.md`
- `BLUEPRINT-EXAMPLE-BAD.md`
- `BLUEPRINT-EXAMPLE-NOTES.md`

## Auto-reject patterns

Reject and rewrite the blueprint draft if any of these are true:

- It opens with `MVP spine`, `Trunk`, `Support Branch`, `Subsystem`, `Forest`, or similar top-down planning structure.
- It opens by re-listing the approved use-case design as the blueprint body's main structure.
- It treats capability buckets, UI lanes, component groups, or engineering workstreams as if they were use cases.
- It names use cases, but the hard implementation judgment still sits in a later summary instead of inside the rehearsals.
- It still behaves like a discussion summary: recommendation bullets or review bullets are carrying the route while artifact-grade route prose is still missing.
- It is really a process or flow specification sheet wearing blueprint headings.
- It is really a simulated player journey wearing blueprint headings.
- It is really a requirements or order bundle wearing blueprint headings.
- It turns the blueprint body into a one-by-one use-case FAQ even though the decisive route is really one shared implementation path.
- A rehearsal explains the desired end-state before it explains the current repo friction that forced the route.
- A rehearsal still reads like a decomposed composite order or specification sheet instead of a technical operator preplay.
- A rehearsal never tells a weaker implementer where to start or what to cut first.
- A rehearsal never names the tempting wrong route, so the likely downstream trap stays invisible.
- The module establishes a root boundary, but the draft still leaves bootstrap owner, candidate-to-live swap, rebind order, or first safe live-runtime touch timing implicit.
- The repo lacks the module's primary entry contract, but the draft still leaves that contract choice as an `Open Question`.
- An `Open Question` would still change the first route cut, root ownership, candidate-vs-live boundary, or first safe live-runtime touch point.
- The supposed parallelization map is decorative rather than derived from the rehearsals.
- It presents a neat outline, but a weaker downstream model would still have to invent the crucial route, authority, or conflict handling.
- Key state or authority ownership is still implicit.
- Repo grounding is only a final reading list rather than being attached to the decisions it justifies.
- It starts pre-cutting tasks, proof scopes, packet context, or dispatch choices.
- It stops because the document already looks tidy rather than because the hard route has been made clear.

## Pass conditions

The blueprint is strong enough for `DG-BLUEPRINT-*` only when all of these are true:

- It begins from real operator-facing use cases.
- The approved use-case design remains upstream input truth rather than becoming the blueprint body's main section.
- The main body follows the decisive implementation route rather than collapsing into a FAQ-shaped use-case march.
- The route has already been drafted at artifact quality before any user-facing summary tries to compress it.
- Each approved use case is clearly covered by that route.
- Each decisive route step clearly covers current-code friction, where to start, the first route cut, the post-cut route, the tempting wrong route, what must remain true, and repo grounding.
- For boundary-establishing modules, the decisive rehearsals also make bootstrap, candidate, swap, rebind, and first safe live-runtime touch timing explicit.
- Each rehearsal starts from current-code friction rather than from tidy route summary or desired end-state.
- The rehearsals are allowed to be uneven in size; harder use cases should usually be longer.
- Shared route decisions appear only after the rehearsals make them obvious.
- Parallelization and convergence are derived from the rehearsals rather than imposed as decoration.
- The hardest design judgment has already been decided inside the blueprint.
- The blueprint still leaves `dag-plan` real work to do: task decomposition, dependency compilation, proof planning, review placement, and dispatch selection.

## Self-check questions

Ask these before surfacing `DG-BLUEPRINT-*`:

- If a weaker execution model saw only this blueprint, would it still need to invent the most important route decision?
- Is the approved use-case design being treated as input and coverage obligation rather than as the markdown body's main structure?
- Does every key use case describe a real operator path rather than a capability area?
- Does every rehearsal explain what current repo reality is fighting against?
- Does every rehearsal make the first implementer move visible instead of hiding it behind end-state language?
- Does the main body follow the order in which a real implementer would probably cut the repo?
- Does every rehearsal reject at least one tempting but wrong route?
- Would a weaker implementer know what the easiest wrong implementation would be and why it is wrong?
- Would that implementer know where to start reading and what route cut must happen first?
- If the module creates or replaces a root boundary, would that implementer know who bootstraps it, when candidate state exists, when live runtime may first be touched, and how swap/rebind actually happens?
- If the repo is missing the module's primary entry contract, has the blueprint already chosen the first honest repo-local contract route?
- Can you point to the owner of each drift-prone state where the use case depends on one?
- Is the parallelization/convergence section a result of the rehearsals, or did it appear first and force the shape?
- If any decisive claim were challenged, can the blueprint point to the exact repo surfaces that justify it?

## Gate behavior

- If any auto-reject pattern fires, revise the blueprint first.
- Do not surface `DG-BLUEPRINT-*` until the draft survives this self-check.
- If the missing clarity is upstream rather than local, route back to `architecture-review` or recommend a `spike`.
