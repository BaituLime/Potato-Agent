---
title: Godot-RUP planning artifact contract
status: active-rebuild
language: C#
---

# Godot-RUP Planning Artifact Contract

This document defines the planning artifacts that execution-side high-frequency surfaces actually need.

## 1. Scope

Use this for:

- `compose-runtime-dag`
- `allocate-worktrees`
- `prepare-packet`
- `settle-layer`
- `repair-delta-plan`

## 2. `decision/<module_id>.json`

- approved route truth for one module
- carries done semantics, acceptance contract, and `repair_policy`
- `repair_policy` is planning truth, not runtime guesswork
- `repair_policy` includes:
  - `mode`
  - allowed result classes
  - preservation guards
  - `max_same_route_delta_per_run` interpreted against the uninterrupted unattended route lineage

## 3. Blueprint artifacts

`blueprint/<module_id>.draft.md`

- current non-authoritative English blueprint draft

`blueprint/<module_id>.draft.json`

- current non-authoritative draft companion index

`blueprint/<module_id>.md`

- authoritative execution blueprint narrative

`blueprint/<module_id>.json`

- thin companion index only

`blueprint-history/<module_id>/...`

- immutable archived blueprint revisions

Execution surfaces should prefer the exact authoritative markdown slice they need rather than reopening the whole blueprint.

Pre-approval discussion should prefer the `*.draft.*` pair.

## 4. Graph artifacts

`graph/<module_id>.json`

- latest approved module-local graph alias
- carries the active `graph_revision_id`
- must pin `source_blueprint_revision_id`
- must preserve `source_realization_ids[]` linkage for packet projection
- carries accepted `proof_rigor` on acceptance inputs
- may carry the active `repair_policy`

`graph-history/<module_id>/...`

- immutable archived superseded graph revisions

## 5. Delta-planning preservation rules

- lawful same-route delegated delta planning may supersede graph truth or paired blueprint-plus-graph truth only when route truth, acceptance bar, and `proof_rigor` remain unchanged
- a superseding graph must preserve or tighten the carried `repair_policy`; it may not drop or widen it
- standalone `blueprint_only` is not a normal lawful output

## 6. Hard rules

- execution may not infer planning truth from chat memory when these artifacts disagree
- runtime may not author new planning truth to avoid a real `replan_needed`
- packet preparation and delta planning must preserve exact revision pins honestly
