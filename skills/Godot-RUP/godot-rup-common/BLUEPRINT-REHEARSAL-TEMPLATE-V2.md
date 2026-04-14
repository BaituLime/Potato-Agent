# Blueprint Rehearsal Template v2

Use this template when drafting or revising an execution blueprint.

The goal is not to split a large order into smaller orders.

The goal is to pre-rehearse the implementation route from a technical operator's point of view so a weaker downstream implementer can inherit the hard route instead of rediscovering it.

Use this concrete test while drafting:

"If I had to start modifying this repo tomorrow, where would I cut first, how would code and state actually flow, and which objects or seams would hand work to each other?"

If the draft does not make that answer visible, it is not yet a strong blueprint rehearsal.

Draft the authoritative artifact first.

Any later Chinese discussion summary should compress that artifact.

It should not replace the artifact or become the skeleton the artifact is written from.

## What this template is for

Use this shape when the draft is drifting toward any of these bad modes:

- a long specification sheet
- a process or flow specification sheet pretending to be implementation preplay
- a simulated player journey pretending to be implementation preplay
- a requirements or order bundle pretending to be implementation preplay
- a list of goals and prohibitions
- a decomposed but still composite order
- a tidy outline that still leaves the crucial implementation route undecided

## Global structure

Keep the global blueprint structure:

1. `Implementation Route`
2. `Coverage Against Approved Use Cases`
3. `Shared Route Decisions`
4. `Derived Parallelization And Convergence`
5. `Out Of Scope`
6. `Open Questions`

This template changes how the rehearsal itself is written.

The approved use-case design remains an upstream input and coverage obligation.

It should not normally be re-listed as a main markdown section.

The markdown body should begin with the implementation route itself.

## Rehearsal core

The main rehearsal body should read like an implementation preplay, not like a requirements bucket or a FAQ.

Use-case-by-use-case sections are allowed when one use case genuinely forces a distinct route.

But do not force one section per use case when that only duplicates the same route in six slightly different ways.

Each decisive route step should answer all of the following in prose:

1. what is fighting us in the current repo
2. where a real implementer would start reading or cutting
3. the first route cut that must happen before the rest becomes safe
4. what the route looks like after that cut
5. the tempting wrong route and why it is wrong
6. what must remain true during implementation
7. what downstream execution should inherit from this rehearsal without reinventing it

For modules that establish or replace a root boundary, the rehearsal must also make all of these explicit:

8. who owns bootstrap of the new root boundary
9. when candidate state exists before becoming live
10. the swap and rebind order
11. when live runtime or live scene objects may first be touched safely

## Suggested section shape

Use headings like these when they help clarity:

- `Current-Code Friction`
- `If I Were Landing This`
- `First Route Cut`
- `Route After That Cut`
- `Tempting Wrong Route`
- `What Must Remain True`
- `Repo Grounding`

For route-first blueprints, also use:

- `Step 1`, `Step 2`, ...
- `Serves approved use cases`
- `Coverage Against Approved Use Cases`

You may merge or smooth these into stronger prose when the writing stays clear.

Do not flatten them into checklist bullets if the route becomes harder to follow.

## Strong pattern

The strongest rehearsal usually sounds like this:

- it names the real conflict, not just the missing feature
- it tells the implementer where to start in the repo
- it makes the first ownership or route cut explicit
- it explains how authority and flow look after that cut
- it names the easiest wrong shortcut
- it states the invariants the implementation must keep
- if the module establishes a root boundary, it makes bootstrap, candidate, swap, and rebind timing explicit

## Weak pattern

Rewrite the rehearsal if it mainly sounds like this:

- "add X"
- "introduce Y"
- "use Z"
- "do not do A/B/C"

That shape may be precise, but it is still mostly an order list.

It does not yet pre-rehearse the implementation route.

It is especially weak if it names a new host, root, contract, or contributor bridge without explaining how that thing first enters the live repo route.

## Entry-contract rule

If the current repo is missing the primary entry contract for the module, the blueprint must choose the first honest repo-local route for that contract.

Examples:

- the first scenario-content contract
- the first session-bootstrap contract
- the first whole-session snapshot envelope route

Do not leave that as an `Open Question` if it changes where implementation starts or what the first route cut must be.

## Boundary-heavy route skeleton

If the module establishes a root boundary, candidate/live boundary, or composite save/load route, one decisive rehearsal should usually make this sequence explicit in prose:

1. the first honest entry contract
2. the query or selection seam for the first real input
3. the candidate builder and its minimal honest input shape
4. the first safe live-runtime touch point
5. the bind or restore surface that joins live presentation to prepared authority
6. the commit, swap, rebind, and teardown order

If the route crosses application-owned authority and presentation-side metadata, say who captures metadata on save and who restores it on load.

Do not stop at naming a host, scene, bridge, or contract. Show how it actually enters the route.

## Coverage rule

The blueprint must still make coverage of the approved use cases explicit.

But coverage should usually be brief and downstream of the route.

The route body explains how implementation proceeds.

The coverage check proves that the approved use cases are satisfied by that route.

Do not reverse those jobs.

Do not turn the markdown body into a re-listing of approved use cases unless the user explicitly asks for that shape.

## Open-question rule

An `Open Question` is allowed only when resolving it does not change any of the following:

- the first route cut
- root ownership
- the primary entry contract
- candidate-versus-live swap boundary
- the first safe live-runtime touch point

If resolving the question would change any of those, it is not a harmless open question.

It is a real blueprint gap.

## Minimal route-first skeleton

```md
## Implementation Route

### Step 1: <first decisive cut>

The real friction in the current repo is ...

If I were landing this now, I would start by reading:
- `...`
- `...`
- `...`

The first route cut is ...

After that cut, the route becomes ...

The tempting wrong route is ...

What must remain true during implementation is ...

Repo grounding:
- `...`
- `...`

Serves approved use cases:
- `UC-...`
- `UC-...`

## Coverage Against Approved Use Cases

- `UC-...` is covered by Steps ...
- `UC-...` is covered by Steps ...
```

## Language rule

Authoritative blueprint artifacts must be written in English.

When discussing recommendations or summarizing the route to the user in chat, use a concise Chinese summary unless the user explicitly asks for another language.

Do not mix a half-English, half-Chinese blueprint artifact.

## Final self-check

Before surfacing `DG-BLUEPRINT-*`, ask:

- Would a `mini`-class obedient implementer still need to invent the decisive implementation route?
- Does the rehearsal tell that implementer where to start and what to cut first?
- Is the route carried in prose, or only implied by a list of desired outcomes?
- Are the most tempting shortcuts explicitly disarmed?

If the answer is wrong for any of those, rewrite the rehearsal.
