---
title: Godot-RUP execution surface protocol
status: draft-rebuild
language: C#
---

# Godot-RUP Execution Surface Protocol

This document defines the only legal path from a returned scheduler slice to a user-facing runner-shell reply.

## 1. Purpose

Execution should not rely on natural reporting points, apology pauses, or the scheduler's prose.

The runner shell owns user-facing surfacing.

Only a reread legal stop may reach the user.

## 2. Inputs

After every returned `orchestrate-runtime` slice, the runner rereads:

- `runs/<run_id>/session.json`
- touched `runs/<run_id>/modules/<module_id>.json`

The runner then writes or refreshes:

- `runs/<run_id>/scheduler-return.json`

## 3. The only legal runner actions

After the receipt is written, the runner may do exactly one thing named by `scheduler-return.json.next_action`:

1. `relaunch_orchestrate_runtime`
2. `surface_stop_to_user`
3. `fail_closed_protocol_blocker`

No other post-scheduler action is a legal surface action.

## 4. Meaning of each action

`relaunch_orchestrate_runtime`

- the runner keeps the run unattended
- the runner does not surface a user-facing pause
- this is the normal path for a legal internal yield such as `dispatch_refresh_needed`
- this may also remain the correct path after legal stop-type-specific handling if that handling honestly converts the candidate stop back into internal continuation

`surface_stop_to_user`

- the runner may surface a user-facing reply only here
- the runner first applies any stop-type-specific cleanup or continuation policy that current execution truth requires
- for `replan_needed`, that stop-type-specific handling includes lawful same-route delta admission, `repair_policy` gate enforcement, lineage-bound checks, and predecessor-run bookkeeping when unattended delegated repair planning is still lawful
- if that stop-type handling legally converts the candidate stop into an internal continuation, the runner keeps the loop internal and does not surface yet
- otherwise the runner reports the exact reread stop reason rather than the scheduler's prose summary
- lawful visible stop requires a real reread `session.stop_reason`; idle drift, uncertainty, or non-progress by themselves are not enough

`fail_closed_protocol_blocker`

- the runner stops without pretending a valid domain stop was reached
- use this when returned state is contradictory or protocol-invalid

## 5. Practical rule

If the receipt does not authorize `surface_stop_to_user`, the runner has no user-facing reply action available.

It must continue unattended or fail closed.

## 6. Authority boundary

- scheduler writes runtime state and may return only a legal stop or a legal runner-handled yield
- the runner decides whether anything may surface to the user
- scheduler prose, producer prose, and analysis prose are explanatory only; they do not authorize a reply

## 7. Legal stop requirement

`surface_stop_to_user` is legal only when reread runtime truth shows a real stop reason such as:

- `manual_needed`
- `replan_needed`
- `ready_for_acceptance`
- `global_blocked`
- `all_done`

If no real stop reason exists, the runner must stay inside unattended continuation.

## 8. Relationship to continuation enforcement

This protocol is the runtime-law surface rule.

Real continuation enforcement may additionally use plugin or hook logic to prevent illegal idle stoppage, but that enforcement must still obey this protocol and the active continuation common docs.
