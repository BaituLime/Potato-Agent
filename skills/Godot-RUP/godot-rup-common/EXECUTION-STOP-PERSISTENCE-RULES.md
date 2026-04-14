---
title: Godot-RUP execution stop persistence rules
status: active-rebuild
language: C#
---

# Godot-RUP Execution Stop Persistence Rules

This document defines how continuation stop state persists across idle turns and later resumes.

## 1. Core rule

Explicit continuation stop belongs to the continuation attachment of the active root execution session.

It should survive ordinary noise.

It should not replace runtime legal-stop truth.

## 2. Stop classes

### Runtime legal stop

Runtime legal stops come only from run-session truth such as:

- `manual_needed`
- `replan_needed`
- `ready_for_acceptance`
- `global_blocked`
- `all_done`

### Explicit continuation stop

Plugin-local stop state prevents reinjection after:

- runner-owned explicit stop setting
- plugin reread of a real legal runtime stop

### Enforcement-local hold

Plugin-local hold state suppresses reinjection without claiming a legal domain stop.

Examples include same-state loop exhaustion or future backoff holds.

## 3. Persistence rule

Once explicit continuation stop is active, it should persist across:

- ordinary user chat
- harmless follow-up messages
- idle events
- tool activity that does not lawfully resume the run

## 4. Clear rule

Explicit continuation stop may be cleared only by lawful resume behavior such as:

- runner explicitly resuming the run
- runner starting a fresh lineage-successor run and registering the new `run_id`
- explicit continuation marker retirement

Ordinary user follow-up does not clear stop state by itself.

## 5. Hold rule

An enforcement-local hold may suppress reinjection.

It may not be surfaced as if runtime reached a legal stop unless runtime truth separately says so.

## 6. Cleanup boundary

Stop persistence does not decide worktree cleanup.

Cleanup timing remains runner-owned under the run-session contract.

## 7. Hard bans

- do not clear explicit stop because of conversation drift alone
- do not surface plugin-local holds as runtime legal stops
- do not let child sessions own separate top-level persistent stop state by default
