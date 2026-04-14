---
title: Godot-RUP execution role map
status: active-rebuild
language: C#
---

# Godot-RUP Execution Role Map

This document defines the active execution-time child role map.

## Core rule

Execution roles are narrow.

The runner shell delegates to bounded producer roles instead of treating every child as a generic do-anything worker.

## Active producer roles

### `task`

- purpose: bounded ordinary implementation change
- producer skill: `run-task`
- should not depend on editor or MCP lifecycle as a primary implementation resource

### `craft`

- purpose: bounded Godot implementation convergence where editor or MCP feedback is part of implementation
- producer skill: `run-craft`
- owns editor or MCP lifecycle for its own bounded scope when required

### `proof`

- purpose: bounded evidence production such as compile, headless, harness, fixture, or MCP proof work
- producer skill: `run-proof`
- produces raw proof attempts only, not authoritative pass

### `review`

- purpose: bounded judgment over a selected scope, diff, or evidence set
- producer skill: `run-review`
- reads and judges only; does not edit implementation

## Delegation rule

The runner shell and scheduler should delegate by role, not by vague capability labels.

That means:

- implementation work goes to `task` or `craft`
- evidence production goes to `proof`
- judgment work goes to `review`

## Learnings propagation rule

Recent execution learnings are carried into packets as bounded context, using an empty array when no bounded same-route learnings currently exist, but they do not outrank authoritative planning truth or runtime state.

Useful learnings include:

- concrete failure mode just encountered
- known trap in the touched surface
- known non-solution already tried in this unattended route
- known local environment quirk relevant to the scope

Learnings must stay narrow and execution-relevant.

## Forbidden role drift

- `task` may not silently become `craft`
- `craft` may not claim final proof or acceptance authority
- `proof` may not silently rewrite implementation scope beyond bounded support work
- `review` may not silently become a new planning phase

If a scope needs a different role, that belongs in graph or delta planning truth, not child improvisation.
