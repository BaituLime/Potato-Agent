---
title: Godot-RUP child prompt contract
status: active-rebuild
language: C#
---

# Godot-RUP Child Prompt Contract

This document defines what every execution child packet must communicate clearly.

## Required packet-to-child truth

Every packet must make all of the following explicit to the producer child:

- exact role of the child
- exact bounded goal
- exact planning revision pin
- exact blueprint markdown anchor when blueprint-derived realization truth is relevant
- exact ownership boundary
- exact forbidden actions
- exact acceptance inputs and proof rigor relevant to the scope
- exact role-specific success shape
- bounded recent execution learnings relevant to this scope

## Role contract

Each packet must carry `role_contract` in the active packet shape.

That role contract must tell the child:

- what role it is performing
- what kind of work belongs inside that role
- what kinds of work must be handed back instead of improvised
- what success looks like for this role

The active packet shape therefore requires at least:

- `role_contract.primary_role`
- `role_contract.success_shape`
- `role_contract.handoff_back_when[]`
- `role_contract.must_not_do[]`

`role_contract.primary_role` must match packet `scope_kind`.

`role_contract.handoff_back_when[]` must include at least the truthful handback cases relevant to the scope, such as:

- packet insufficiency
- role mismatch
- broader planning change needed
- broader route redesign needed
- authority outside the leaf worker boundary

`role_contract.must_not_do[]` must name the forbidden widenings relevant to that role.

## Learnings rule

Packets must carry `recent_execution_learnings[]` in the active packet shape.

That field may be empty when no bounded same-route learnings currently exist.

These are hints from the current unattended route, not new planning truth.

They should be used to avoid repeated mistakes, not to widen scope.

## Blueprint anchor rule

When a packet carries blueprint-derived realization truth, the child must treat the packet's blueprint markdown anchor as the primary reread window.

That means:

- prefer the exact `source_markdown_path`
- start from `source_line_offset`
- use `source_line_length` as the default primary slice to understand first
- expand to nearby or other blueprint sections only when the packet or the work honestly requires it

Do not ignore the anchor and jump straight into a freeform whole-blueprint reread just because the worker feels uncertain.

## Handback rule

If a child packet still cannot support bounded honest execution, the producer must hand that truth back in the raw attempt.

The child may not silently widen itself into a new role, scheduler, planner, acceptance surface, or continuation owner.

## Fail-closed rule

If a child packet cannot support bounded honest execution, the producer should fail explicitly in the raw attempt instead of expanding its own authority.
