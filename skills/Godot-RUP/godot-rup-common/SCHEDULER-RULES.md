---
title: Godot-RUP scheduler rules
status: active-rebuild
language: C#
---

# Godot-RUP Scheduler Rules

This document defines the scheduler-local execution rules only.

## 1. Covered surfaces

Use this for:

- `orchestrate-runtime`
- `prepare-packet`
- `settle-layer`
- `integrate-layer`

## 2. Scheduler authority

- `orchestrate-runtime` is the only scheduler
- it runs only in the root runner context
- producer children are first-level leaves only
- scheduler owns runtime progression, not user-facing surfacing

## 3. Scheduler sequence

The scheduler may do only this:

1. read the combined runtime graph and weave
2. prepare packets locally
3. dispatch `task`, `craft`, `proof`, or `review` producer leaves
4. wait only for already in-flight leaves
5. settle drained layers locally
6. integrate integration-gated layers locally
7. stop only at a real stop or a legal runner-handled yield

## 4. Producer-child rule

- dispatch only native OpenCode children for `run-task`, `run-craft`, `run-proof`, and `run-review`
- preserve packet `graph_revision_id`, role, and resolved dispatch fields
- do not silently reroute to fallback profiles
- producer leaves are terminal; no nested built-in subtask dispatch

## 5. Fail-fast rule

- writer scopes may fan out normally when the admitted epoch allows it
- proof and review scopes are fail-fast by default
- after a decisive `partial` or `blocked` raw proof/review result in a layer, do not launch untouched later proof/review siblings in that same layer

## 6. Packet rule

- `prepare-packet` copies approved truth; it does not reinterpret it
- packets must preserve exact revision pins, role contract, resolved dispatch fields, accepted `proof_rigor`, and bounded blueprint excerpt when present
- fail closed if the approved child profile or blueprint linkage cannot be resolved honestly

## 7. Settlement and integration boundaries

- `settle-layer` owns `attest` then `gate`
- it may write authoritative scope evidence and layer settlement only
- `integrate-layer` owns module-local layer integration only
- neither skill owns final session stop surfacing or planning repair

## 8. Rework boundary

- if a settled `rework_needed` layer still has a lawful preapproved repair continuation in the current graph, continue execution
- if not, stop at real `replan_needed`
- scheduler may not author new planning truth to avoid that stop

## 9. Legal return states

Before returning, scheduler truth must be exactly one of:

- `current_phase = stopped` with a real `stop_reason`
- `current_phase = orchestrating` with `yield_reason = dispatch_refresh_needed`

Any other return state is invalid.

## 10. Hard bans

- do not surface to the user from scheduler prose
- do not own same-route delegated delta planning
- do not fabricate `global_blocked` where lawful `replan_needed` or `manual_needed` should exist
