# Blueprint Review Gate v2

This document defines how `execution-blueprint` should decide whether a draft is ready for `DG-BLUEPRINT-*`.

## 1. Core rule

`DG-BLUEPRINT-*` is not a style gate.

It is the gate for whether the implementation route has been pre-rehearsed strongly enough that downstream planning does not have to invent the decisive route.

## 2. Gate verdicts

Use exactly one of these verdict classes when finishing a blueprint draft.

### `ready_for_blueprint_gate`

Use only when:

- the draft survives the blueprint rubric
- no decisive blueprint gaps remain
- the route is clear enough for weaker downstream execution to inherit
- the latest fresh `godot-rup-review-blueprint-draft` pass on the current draft also returns `ready_for_blueprint_gate`

### `revise_blueprint_locally`

Use when:

- the route is locally recoverable inside the blueprint phase
- the missing clarity is still blueprint-level rather than upstream architectural uncertainty

### `return_to_architecture_review`

Use when:

- the missing clarity is upstream route uncertainty
- blueprint cannot honestly decide the route without re-opening technical route approval

### `recommend_spike`

Use when:

- a bounded technical uncertainty must be validated before blueprint truth can be honest

## 3. Ready-for-gate bar

Do not use `ready_for_blueprint_gate` unless all are true:

- each key use case has a real technical operator preplay
- the first implementer move is visible
- the first route cut is visible
- the tempting wrong route is explicit
- ownership boundaries are clear enough to survive execution
- repo grounding supports the decisive route claims
- if the module establishes a root boundary, bootstrap, candidate, swap, rebind, and first safe live-runtime touch timing are explicit enough to inherit
- if the repo lacks the module's primary entry contract, the blueprint has already chosen the first honest repo-local contract route
- the blueprint is not leaking into workflow, proof, review, dispatch, or repair policy decisions

Open questions are allowed only when they do not change the first route cut, root ownership, primary entry contract, candidate-vs-live boundary, or first safe live-runtime touch point.

## 4. User-facing discussion rule

When discussing gate readiness with the user in chat:

- summarize in concise Chinese
- keep the artifact itself in English
- do not paste a half-English artifact draft into the discussion summary unless the user asks for it

## 5. Suggested discussion shape

1. current verdict class
2. the two or three decisive reasons
3. whether the next action is local blueprint revision, upstream architecture return, or a spike

## 6. Hard bans

- do not surface `DG-BLUEPRINT-*` just because the draft looks tidy
- do not hide decisive route gaps behind a long blueprint
- do not call the draft ready if weaker downstream execution still has to invent the route
