---
title: Godot-RUP runtime artifact contract
status: active-rebuild
language: C#
---

# Godot-RUP Runtime Artifact Contract

This document defines the runtime files that high-frequency execution surfaces actually need.

## 1. Scope

Use this for:

- `godot-rup-runner`
- `compose-runtime-dag`
- `allocate-worktrees`
- `orchestrate-runtime`
- `prepare-packet`
- `settle-layer`
- `integrate-layer`
- `cleanup-run-worktrees`
- `repair-delta-plan` when it needs runtime context

## 2. `runs/<run_id>/session.json`

- one unattended execution or acceptance session
- `run_id` is the concrete current run subtree
- `lineage_run_id` is the uninterrupted unattended route lineage id
- `previous_run_id` points to the immediate predecessor run when this run is a fresh successor; otherwise `null`
- `current_phase`, `yield_reason`, `continue_reason`, `resume_reason`, `stop_reason`, and `stop_scope` are authoritative runtime state
- `environment_blocker` is for execution-context insufficiency, not ordinary implementation failure
- reuse is lawful only when the active `session_format` already matches the current machine shape

## 3. `runs/<run_id>/scheduler-return.json`

- runner-owned reverse-gate receipt after a returned scheduler slice
- derived from reread `session.json` plus touched `modules/<module_id>.json`
- legal `next_action` values are:
  - `relaunch_orchestrate_runtime`
  - `surface_stop_to_user`
  - `fail_closed_protocol_blocker`
- scheduler prose never overrides this receipt

## 4. `runs/<run_id>/modules/<module_id>.json`

- module-local runtime truth for one run
- authoritative `status`
- active `graph_revision_id`
- active/pending layer and scope tracking
- readiness for acceptance
- `last_integration_commit` and `last_mainline_commit` when truthful
- bounded `recent_execution_learnings[]`
- lineage-carried same-route delta bookkeeping:
  - `delta_attempt_count`
  - `last_delta_result_class`
  - `last_delta_trigger_summary`
  - superseded/new graph and blueprint revision ids
  - `delta_history_refs`
- reuse is lawful only when the active `module_session_format` already matches the current machine shape

## 5. Runtime planning products

`runs/<run_id>/combined-dag.json`

- namespaced merged runtime graph

`runs/<run_id>/dispatch-weave.json`

- whole-layer runtime weave only

`runs/<run_id>/slot-demand.json`

- peak worker-slot demand plus fixed integration-slot demand

`runs/<run_id>/slot-table.json`

- actual worker and integration slot occupancy

`runs/<run_id>/todo.json`

- operator-readable progress view only

## 6. Runtime leaf and settlement artifacts

`runs/<run_id>/packets/<module_id>/<scope_id>.json`

- one run-local packet
- carries exact `graph_revision_id`, role contract, accepted `proof_rigor`, resolved dispatch fields, and bounded blueprint excerpt when needed

`runs/<run_id>/attempts/...`

- raw leaf-worker output only
- never authoritative pass

`evidence/<module_id>/<scope_id>/summary.json`

- authoritative scope evidence after settlement only

`runs/<run_id>/settlements/...`

- authoritative drained-layer settlement

`runs/<run_id>/integrations/...`

- authoritative per-layer integration record

## 7. Reuse and succession rules

- if active graph revisions changed, do not reuse the old run subtree
- if lawful same-route delegated delta planning superseded planning truth, start a fresh successor run
- a fresh successor run must preserve `lineage_run_id`
- a fresh successor run must set truthful `previous_run_id`
- a fresh successor run must inherit truthful delta bookkeeping from the stopped predecessor instead of resetting route-lineage history

## 8. Hard rules

- runtime branches only from written artifacts, not chat recap
- stale run artifacts remain historical evidence and may not masquerade as current live state
- packet, attempt, settlement, and integration artifacts do not own top-level stop or planning authority
