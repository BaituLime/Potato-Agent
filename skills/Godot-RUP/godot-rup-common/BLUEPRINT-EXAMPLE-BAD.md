# Bad Execution Blueprint Example

This is a negative exemplar.

It shows the shape that should be rejected before `DG-BLUEPRINT-*`.

## Bad shape

### MVP spine

- build host shell foundation
- add data catalog
- add input registry
- add world stage
- add observe lane
- add operate lane
- add interrupt lane

### Trunk

- host shell foundation

### Support branches

- data catalog
- input registry
- world stage

### Use cases

- observe lane
- operate lane
- interrupt lane

### Why this passes

- it covers all major areas

### Simulated player journey

- the player enters the scene and sees the start strip
- the player clicks new game and sees a confirmation prompt
- the player chooses a scenario and sees the world appear
- the player saves and sees success feedback
- the player loads and sees the world restore

### Process specification sheet

- open the shell
- show the start strip
- show the scenario selector
- create the session
- bind the scene
- save the session
- load the session
- show refusal feedback

### Requirements bundle

- the system shall support new game
- the system shall support save
- the system shall support load
- the system shall preserve valid state on failed load
- the system shall show active session identity
- the system shall expose refusal feedback

## Why it fails

- It starts with an `MVP spine`, not with real operator-facing use cases.
- It begins from implementation buckets and then appends capability-labeled pseudo-use-cases.
- The simulated player journey looks concrete, but it is still only a user-facing walkthrough. It does not pre-rehearse where implementation starts, what gets cut first, or how ownership and code flow move through the repo.
- The process specification sheet looks orderly, but it is only a sequence of desired steps. It does not say how those steps are made honest in current repo reality.
- The requirements bundle looks complete, but it is still just an order list. It tells the implementer what should exist, not how to cut the repo so it becomes true.
- It never rehearses concrete current-code friction, the first route cut, rejected tempting routes, or implementation invariants.
- It reads like a tidy plan outline or decomposed order, not an implementation rehearsal.
- Hard route and authority judgment are still missing, so downstream planning would have to invent them.
