---
title: Godot-RUP same-route delta rules
status: active-rebuild
language: C#
---

# Godot-RUP Same-Route Delta Rules

This document defines lawful same-route delegated delta planning only.

## 1. Covered surfaces

Use this for:

- `godot-rup-runner`
- `repair-delta-plan`

## 2. Entry boundary

- same-route delegated delta planning starts only after a real `replan_needed` stop
- scheduler must stop there; it may not author planning truth to avoid that stop

## 3. Runner admission gate

After the real stop, the runner may ask only whether invoking delegated same-route delta planning is lawful at all.

Admission requires:

- use-case truth unchanged
- route truth unchanged
- acceptance bar unchanged
- `proof_rigor` unchanged
- failure still local to one module
- no obvious workflow-shape redesign, new decision gate, cross-module redesign, or new user preference judgment
- carried `repair_policy` still allows same-route delegated delta planning
- carried result-class gates still permit at least one honest repair shape
- carried lineage delta-count bound is not exhausted

If any point is no or uncertain, fail closed to visible replanning.

## 4. Result-class authority

- the runner does not choose `graph_delta_only` versus `blueprint_plus_graph_delta`
- `repair-delta-plan` owns that finer result-class judgment

## 5. Legal result classes

`graph_delta_only`

- lawful only when blueprint truth remains sufficient
- lawful only when `repair_policy.allow_graph_delta_only = true`

`blueprint_plus_graph_delta`

- lawful only when same-route blueprint truth is insufficient but route truth, acceptance bar, and `proof_rigor` remain unchanged
- lawful only when `repair_policy.allow_blueprint_plus_graph_delta = true`

`escalate_visible_replanning`

- required when same-route preservation cannot be attested honestly
- required when the only honest repair shape would need a forbidden result class
- required when the route-lineage delta history is no longer convergent

Standalone `blueprint_only` is not a lawful normal output.

## 6. Policy inheritance rule

- every lawful superseding graph must preserve or tighten the carried `repair_policy`
- do not widen or drop the policy while writing the superseding graph

## 7. Lineage bound rule

- `repair_policy.max_same_route_delta_per_run` is interpreted against the uninterrupted unattended route lineage
- lawful fresh successor runs after delta do not reset that bound
- runner checks `delta_attempt_count` before invoking `repair-delta-plan`

## 8. Bookkeeping before successor run

After a lawful non-escalation result, the runner must first update the stopped predecessor module session with:

- incremented `delta_attempt_count`
- `last_delta_result_class`
- truthful trigger summary
- truthful superseded/new revision ids
- `delta_history_refs` that include the stopped predecessor module-session path

Only then may the runner create a fresh successor run.

## 9. Successor-run rule

- lawful delta resumes through a fresh successor run, never by mutating the stopped run in place
- the successor run preserves `lineage_run_id`
- the successor run records truthful `previous_run_id`
- the successor run inherits truthful delta bookkeeping from the predecessor

## 10. Hard bans

- do not ask the user for extra approval merely because lawful same-route delta planning is happening
- do not rewrite approved use-case or route truth
- do not weaken acceptance evidence requirements
- do not downgrade `proof_rigor`
