---
title: Godot-RUP idle reinjection and loop guard rules
status: active-rebuild
language: C#
---

# Godot-RUP Idle Reinjection And Loop Guard Rules

This document defines when continuation may reinject unattended execution after idle drift and when it must stop reinjecting.

## 1. Core rule

Idle reinjection is a bounded enforcement tool.

It is not a replacement for:

- runtime truth
- same-route repair law
- legal stop diagnosis

## 2. Reinjection preconditions

Reinjection is allowed only when all are true:

1. an active root-session continuation attachment exists
2. explicit continuation stop is not active
3. enforcement-local hold is not active
4. recovery suppression is not active
5. cooldown has expired
6. runtime artifacts can be reread
7. reread runtime truth does not show a legal stop
8. runner receipt truth is not protocol-blocked or internally contradictory

## 3. Runtime reread rule

Before reinjecting, continuation enforcement must reread current runtime truth, including at least:

- `session.json`
- `scheduler-return.json` when present
- current module runtime summaries for the attached modules

## 4. Legal-stop short circuit

If reread runtime truth shows a legal stop, continuation enforcement must:

1. persist explicit continuation stop
2. stop reinjecting

If reread runner receipt truth is protocol-blocked or internally contradictory, continuation enforcement must persist an enforcement-local hold and stop reinjecting.

## 5. Same-state loop guard

Continuation enforcement may guard against repeated identical runtime states.

When same-state loop protection trips, that becomes an enforcement-local hold, not a fake domain stop by itself.

## 6. Repair boundary

Loop exhaustion or idle reinjection exhaustion does not itself authorize `repair-delta-plan`.

Same-route delegated delta planning still requires a real `replan_needed` stop under runtime law.

## 7. Hard bans

- do not reinject when runtime truth already shows a legal stop
- do not turn loop exhaustion by itself into fake `replan_needed`
- do not create duplicate root execution sessions by default
- do not let plugin-local loop guards replace runner-owned stop diagnosis
