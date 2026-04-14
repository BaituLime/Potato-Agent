---
title: Godot-RUP leaf worker contract
status: active-rebuild
language: C#
---

# Godot-RUP Leaf Worker Contract

This document defines the active contract for bounded producer children in unattended execution.

## 1. Covered surfaces

This contract applies to:

- `run-task`
- `run-craft`
- `run-proof`
- `run-review`

## 2. Core rule

A producer child is a leaf worker.

Its job is to execute one bounded packet and hand back one raw attempt.

It is not a new conductor, planner, acceptance surface, or continuation owner.

## 3. Required posture

Every producer leaf must:

- execute exactly one packet
- stay inside the assigned checkout and ownership boundary
- respect the packet's exact role, bounded goal, planning revision pin, and role contract
- treat `recent_execution_learnings[]` only as bounded route-local guidance
- write exactly one raw attempt for the scope
- fail explicitly in the raw attempt when bounded honest execution cannot be completed

## 4. Read discipline

Every producer leaf should start from:

- the packet
- packet-listed files
- the packet's blueprint anchor when present

Do not reopen the whole blueprint or surrounding repo by default just because the child feels uncertain.

Expand only when the packet or the bounded work honestly requires it.

## 5. Handback rule

If the leaf worker discovers any of the following, it must hand back raw truth rather than widen authority:

- packet insufficiency
- role mismatch
- need for broader planning change
- need for broader route redesign
- need for acceptance or evidence authority it does not own

That handback belongs in the raw attempt.

## 6. Leaf boundary

Producer leaves may not own:

- top-level continuation behavior
- legal stop diagnosis
- scheduler progression
- same-route delegated delta planning
- acceptance verdicts
- shipping state

## 7. Nested-dispatch rule

Producer leaves are terminal execution leaves for this runtime.

They should not spawn nested producer children or replacement schedulers.

## 8. Raw-attempt rule

Producer leaves may self-claim only raw statuses such as:

- `ready_for_attest`
- `partial`
- `blocked`

They may not claim authoritative `pass`.

They may not convert their own output into authoritative evidence or settlement truth.

## 9. Role-specific handback discipline

### `task`

- ordinary bounded implementation only
- may not silently absorb `craft`, `proof`, or replanning work

### `craft`

- bounded implementation convergence with editor or MCP-backed feedback when required by the packet
- may not silently claim final proof or acceptance completion

### `proof`

- evidence-producing work only
- may not silently widen into replanning or broad implementation redesign

### `review`

- bounded judgment only
- may not silently become fresh planning or implementation labor

## 10. MCP and editor boundary

When a packet truthfully requires MCP or editor access for `craft`, `proof`, or `review`, that producer leaf owns the local lifecycle for its own bounded scope.

Ordinary `task` work should not quietly rely on editor or MCP lifecycle as a hidden prerequisite.

## 11. Hard bans

- do not improvise a new role because it would be convenient
- do not widen the packet boundary to avoid handing back difficulty
- do not spawn nested producer children
- do not write authoritative evidence or settlement truth
- do not convert a bounded leaf into a new root execution shell
