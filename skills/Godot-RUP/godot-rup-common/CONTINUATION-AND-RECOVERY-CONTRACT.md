---
title: Godot-RUP continuation and recovery contract
status: active-rebuild
language: C#
---

# Godot-RUP Continuation And Recovery Contract

This document defines the active continuation and recovery contract for unattended execution.

## 1. Core rule

Continuation and recovery are enforcement layers around runtime law.

They do not replace:

- run-session truth
- the runner shell
- scheduler authority
- same-route repair law

## 2. Existing active foundation

The active local continuation foundation includes:

- plugin `godot-rup-continuation`
- `godot_rup_register_run`
- `godot_rup_set_continuation_stop`
- `godot_rup_clear_run_marker`
- idle-time runtime reread before reinjection
- recovery-window suppression
- reinjection cooldown
- same-state loop guarding

Phase 2 preserves this route and tightens its boundaries.

## 3. Authority split

### Runtime truth

Authoritative execution truth remains under the handoff root, especially:

- `runs/<run_id>/session.json`
- `runs/<run_id>/scheduler-return.json`
- `runs/<run_id>/modules/<module_id>.json`

### Continuation enforcement state

Plugin-local continuation state may track:

- active run attachment
- explicit continuation stop state
- enforcement-local hold state
- recovery suppression window
- reinjection timestamps and counters
- same-state guard data

Plugin-local state may not replace runtime truth.

### Root ownership

`godot-rup-runner` owns:

- root continuation posture
- legal-stop surfacing
- runner-side stop integration
- any lawful same-route delegated delta planning after a real `replan_needed` stop

Producer leaves do not own top-level continuation sovereignty.

## 4. Attachment rule

Continuation attaches to the active root execution session for one unattended run.

Producer child sessions and delegated repair-planning child sessions should not own independent unattended continuation markers by default.

## 5. Idle continuation rule

When the attached root session goes idle, continuation enforcement should:

1. load plugin-local state
2. stop if no active attachment exists
3. stop if explicit continuation stop is active
4. stop if an enforcement-local hold is active
5. suppress reinjection while recovery is active
6. reread current runtime truth
7. if runtime truth shows a legal stop, persist explicit continuation stop and do not reinject
8. if runner receipt truth is protocol-blocked or internally contradictory, persist an enforcement-local hold and do not reinject
9. otherwise apply cooldown and loop guards
10. if guards pass, reinject continuation into the same root execution route

## 6. Recovery rule

Recovery suppression is a temporary enforcement state after session or provider instability.

It is not a legal domain stop.

It exists to prevent noisy reinjection during unstable host conditions.

## 7. Failure-repair boundary

Continuation enforcement may keep execution alive before a real repair boundary exists.

It may not trigger planning repair directly.

Only the runner shell may consider lawful same-route delegated `repair-delta-plan`, and only after runtime truth reaches a real `replan_needed` stop.

## 8. Hard bans

- do not create a second parallel continuation system by default
- do not let plugin-local state replace runtime truth
- do not let continuation enforcement fabricate legal stop reasons
- do not let continuation enforcement invoke `repair-delta-plan` directly
- do not let producer leaves own top-level continuation markers by default
