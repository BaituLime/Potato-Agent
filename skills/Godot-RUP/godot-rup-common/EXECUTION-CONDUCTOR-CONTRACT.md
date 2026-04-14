---
title: Godot-RUP execution conductor contract
status: active-rebuild
language: C#
---

# Godot-RUP Execution Conductor Contract

This document defines the active conductor-side contract for unattended execution.

## 1. Conductor family

Execution conductors are the coordination surfaces that move a run forward without becoming producer workers.

The active conductor family is:

- `godot-rup-runner` as the top-level root execution shell
- `orchestrate-runtime` as the internal scheduler conductor
- same-context scheduler-local phases `prepare-packet`, `settle-layer`, and `integrate-layer`

These surfaces coordinate execution.

They do not replace bounded producer leaves.

## 2. Core rule

Conductors coordinate.

Leaf workers execute one bounded scope and hand back one raw truth artifact.

Do not collapse those jobs together.

## 3. Root runner shell authority

`godot-rup-runner` owns:

- top-level unattended execution entry and resume
- run creation or lawful run reuse
- continuation registration and stop integration
- runner-owned reread after every returned scheduler slice
- user-facing surfacing under `EXECUTION-SURFACE-PROTOCOL.md`
- lawful same-route delegated `repair-delta-plan` after a real `replan_needed` stop when approved `repair_policy` still allows it
- runner-owned decision about whether a stopped run should later be cleaned or preserved

`godot-rup-runner` may not:

- become the normal producer of implementation, proof, or review work
- branch on scheduler prose instead of reread runtime truth
- host the scheduler inside a child agent
- let plugin-local continuation state replace run-session truth

## 4. Scheduler conductor authority

`orchestrate-runtime` owns:

- reading current runtime truth
- selecting ready work under current combined DAG and dispatch weave
- running `prepare-packet`, `settle-layer`, and `integrate-layer` in the same scheduler context
- dispatching first-level producer children only
- waiting only on already-dispatched producer children
- stopping at `replan_needed` when no lawful preapproved continuation exists in the current graph

`orchestrate-runtime` may not:

- surface to the user directly
- become a planning surface
- author same-route delegated delta planning itself
- treat producer children as new schedulers
- use a returned summary sentence as stop authority instead of reread runtime truth

## 5. Same-context rule

`prepare-packet`, `settle-layer`, and `integrate-layer` are conductor-local phases inside the scheduler context.

They are not producer children.

They are not new user-facing execution surfaces.

## 6. Leaf-worker rule

Producer children are leaf workers by default.

Conductors must treat them as:

- bounded
- packet-driven
- role-specific
- raw-attempt-producing

Conductors must not treat them as:

- mini-schedulers
- replacement planners
- hidden acceptance authorities
- top-level continuation owners

## 7. Conductor verification rule

Conductors should not trust child self-report by itself.

Conductor action must branch from authoritative reread inputs such as:

- `session.json`
- `modules/<module_id>.json`
- packet truth
- raw attempt artifacts
- settlement results

Producer prose is explanatory only.

## 8. Role-mismatch handback rule

If a producer child truthfully hands back that:

- the packet cannot support bounded honest execution
- the assigned role is wrong for the actual work
- the scope now needs broader route change or planning change

then conductor surfaces must treat that as handback truth to be processed inside runtime law.

They must not instruct the child to silently widen its own authority.

## 9. Continuation boundary

Conductors participate in continuation law, but they do not all own it equally.

- `godot-rup-runner` owns root continuation posture and user-facing stop surfacing
- `orchestrate-runtime` owns legal internal yields and scheduler-side runtime progression
- producer leaves do not own top-level continuation sovereignty

## 10. Failure-repair boundary

The conductor family must preserve the current repair law.

- scheduler continues inside already-approved graph continuation when it exists
- scheduler stops at real `replan_needed` when it does not
- only the root runner shell may invoke lawful same-route delegated `repair-delta-plan`
- the runner may judge only admission into same-route delegated delta planning; `repair-delta-plan` owns the finer result classification
- the runner must enforce `repair_policy` result-class guards and the carried lineage delta bound before invoking `repair-delta-plan`
- after a lawful superseding revision, the runner starts a fresh run instead of mutating stale live run truth in place

## 11. Hard bans

- do not let the runner shell quietly become a generic producer worker
- do not let the scheduler quietly become a planning surface
- do not let producer leaves quietly become conductors
- do not let child self-report override runtime reread truth
- do not let conductor convenience bypass the current same-route repair boundary
