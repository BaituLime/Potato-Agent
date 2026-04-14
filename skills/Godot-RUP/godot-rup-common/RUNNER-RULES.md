---
title: Godot-RUP runner rules
status: active-rebuild
language: C#
---

# Godot-RUP Runner Rules

This document defines the root unattended runner shell only.

## 1. Covered surfaces

Use this for:

- `godot-rup-runner`
- `compose-runtime-dag`
- `allocate-worktrees`
- `cleanup-run-worktrees`

## 2. Root context rule

- unattended execution must start from the root conversation context that can open first-level producer children
- do not host `orchestrate-runtime` inside a child agent

## 3. Run create or reuse

- reuse only when active graph revisions still match the candidate run's pinned module revisions
- reuse only when `session.json` and all requested `modules/<module_id>.json` files already match the active runtime machine shapes
- if lawful same-route delegated delta planning superseded planning truth, create a fresh successor run instead of mutating the old run in place

## 4. Lineage rule

- a lineage-root run writes `lineage_run_id = run_id` and `previous_run_id = null`
- a lawful delta successor run preserves the predecessor lineage id and records `previous_run_id`
- fresh successor runs do not reset same-route delta history

## 5. Core runner sequence

The runner may do only this:

1. resolve handoff root and requested modules
2. create or reuse the run lawfully
3. register the active run when a concrete `run_id` exists
4. run `compose-runtime-dag`
5. run `allocate-worktrees`
6. run `orchestrate-runtime`
7. reread runtime artifacts after every returned scheduler slice
8. write `scheduler-return.json`
9. follow only the receipt-authorized next action

## 6. Reverse gate

- only `scheduler-return.json.next_action` may decide the runner's post-scheduler action
- legal actions are:
  - `relaunch_orchestrate_runtime`
  - `surface_stop_to_user`
  - `fail_closed_protocol_blocker`
- scheduler prose never authorizes surfacing by itself

## 7. Stop surfacing

- the runner may surface to the user only when reread runtime truth still shows a real stop
- `dispatch_refresh_needed` stays internal
- for `replan_needed`, the runner first applies the active delta law before surfacing

## 8. Cleanup timing

- smooth completion stops such as `ready_for_acceptance` normally trigger immediate `cleanup-run-worktrees`
- blocked or stalled stops such as `manual_needed`, `replan_needed`, or `global_blocked` defer cleanup by default until the runner decides the stopped run is being retired

## 9. Continuation stop hygiene

- register the active run as soon as the concrete `run_id` exists
- before surfacing a real legal stop, set explicit continuation stop truthfully
- clear that stop only by lawful resume, lawful fresh successor run, or explicit marker retirement

## 10. Hard bans

- do not branch on scheduler prose instead of reread artifacts
- do not stop unless a real legal stop exists after stop-type handling
- do not ignore active runtime machine shapes during run reuse
- do not reuse stale live state after lawful delta supersession
