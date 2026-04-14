---
title: Godot-RUP execution learnings contract
status: active-rebuild
language: C#
---

# Godot-RUP Execution Learnings Contract

This document defines the active bounded learnings pipeline for unattended execution.

## 1. Core rule

Execution learnings are bounded same-route execution aids.

They are not replacement planning truth.

They are not acceptance truth.

They are not plugin-owned continuation truth.

## 2. Write path

Module-local recent execution learnings live in:

- `runs/<run_id>/modules/<module_id>.json`

`settle-layer` is the first active writer that may distill narrow recent execution learnings from raw attempts for later same-route scopes in that module.

## 3. Read path

`prepare-packet` reads bounded recent execution learnings from the current module session and carries them into packet `recent_execution_learnings[]`.

Producer leaves read that packet field as bounded execution guidance only.

## 4. Content rule

Useful execution learnings include only narrow same-route guidance such as:

- a concrete failure mode already encountered
- a known trap in the touched surface
- a known non-solution already tried in the current unattended route
- a local environment quirk relevant to the scope

Do not store broad route redesign ideas, user-preference arbitration, or replacement planning decisions as execution learnings.

## 5. Boundedness rule

Execution learnings should stay:

- module-local
- same-route
- recent
- execution-relevant
- short enough to be carried cheaply into later packets

## 6. Hard bans

- do not let execution learnings outrank planning truth or runtime truth
- do not use execution learnings as shadow replanning
- do not carry stale or decorative learnings forever
