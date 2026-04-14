# Blueprint Gap Analysis v2

Use this guide while drafting or revising an execution blueprint.

The point of gap analysis is not to criticize the draft for being incomplete in the abstract.

The point is to identify exactly what is still missing before a weaker downstream implementer could inherit the route safely.

## 1. Core rule

A blueprint gap is any missing route clarity that would force downstream planning or execution to invent a crucial implementation judgment.

If the downstream implementer still has to invent the route, the blueprint is not ready.

## 2. Gap classes

Use these classes when analyzing a draft.

### `route_gap`

- the draft states what should exist, but not how the implementer should approach the route

### `first_cut_gap`

- the draft does not make the first ownership or route cut explicit

### `start_here_gap`

- the draft does not tell a real implementer where to begin reading or cutting in the repo

### `authority_gap`

- state ownership, boundary ownership, or conflict ownership is still implicit

### `wrong_route_gap`

- the easiest plausible wrong implementation route is not explicitly named and rejected

### `repo_grounding_gap`

- the route claim is not tied tightly enough to the repo surfaces that forced it

### `phase_boundary_gap`

- the draft leaks into workflow, proof, review, dispatch, or repair policy that should remain in later phases

### `composite_order_gap`

- the draft is still functioning like a decomposed but composite order rather than a technical operator preplay

### `bootstrap_gap`

- the draft introduces a new host, root, or composition boundary without making bootstrap and first live entry explicit

### `candidate_swap_gap`

- the draft does not make candidate-versus-live construction, swap, and rebind order explicit where that distinction is decisive

### `entry_contract_gap`

- the repo lacks the module's first real content or input contract, but the blueprint has not yet chosen the first honest route for it

### `live_touch_gap`

- the draft does not say when live runtime, live scene objects, or live presentation nodes may first be touched safely

## 3. What to analyze

For each key use case, ask:

1. Could a `mini`-class obedient implementer start from this rehearsal without inventing the crucial route?
2. Does the rehearsal make the first implementer move visible?
3. Does it make the first route cut visible?
4. Does it explain which shortcut is most tempting and why it must be rejected?
5. Does it make the ownership boundary explicit enough to survive execution?
6. Does it point back to the repo surfaces that justify the route?
7. Has it drifted into later-phase concerns instead of staying at implementation rehearsal level?
8. If the module establishes a root boundary, does it make bootstrap, candidate, swap, and rebind timing explicit?
9. If the repo lacks the module's primary entry contract, has the blueprint already chosen the first honest route for that contract?
10. Does the draft make the first safe live-runtime touch point explicit when that boundary matters?

Any "no" above is a real blueprint gap.

## 4. Recommended summary shape

When discussing a draft with the user, summarize blueprint gaps in concise Chinese.

A useful shape is:

1. strongest part of the draft
2. decisive gaps that still block `DG-BLUEPRINT-*`
3. whether the fix is local blueprint revision, upstream architecture return, or a spike recommendation

## 5. Gate consequence

If a decisive gap remains, do not surface `DG-BLUEPRINT-*`.

Instead choose one of:

- revise blueprint locally
- return upstream to `architecture-review`
- recommend a bounded `spike`

## 6. Anti-pattern

Do not write a gap analysis like a second blueprint.

Gap analysis should identify what is missing, not replace the blueprint artifact itself.
