---
name: orchestrate-runtime
description: Schedule one run session by preparing packets, dispatching run scopes, settling drained layers, and handing per-module layers to integration. Use as the only scheduler for rebuilt execution.
compatibility: opencode
---

# Orchestrate Runtime (Godot-RUP + C#)

Use this Skill as the only scheduler for rebuilt unattended execution.

Run it only in the `Root Runner Context` that can open first-level producer children directly. Do not host this scheduler inside a child agent. When the top-level `run` surface was directly used by the user in the current conversation, treat that as sufficient root-context evidence unless explicit contrary evidence shows you are already inside a child agent or nested producer context.

Canonical references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/SCHEDULER-RULES.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/RUNTIME-ARTIFACT-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/LEAF-WORKER-CONTRACT.md`

## Uses only these skills

This list is the scheduler's internal dependency set.

- The runner shell may still be restricted to invoking only `compose-runtime-dag`, `allocate-worktrees`, and `orchestrate-runtime` at the top level.
- That top-level restriction does not forbid `orchestrate-runtime` from using the skills below inside its own scheduler context.
- Interpreting a runner-level "use only these three skills" instruction as a ban on the scheduler's own internal dependencies is incorrect.

- `prepare-packet`
- `run-task`
- `run-craft`
- `run-proof`
- `run-review`
- `settle-layer`
- `integrate-layer`

## Goal

- keep the run moving unattended until a real stop reason or explicit runner-handled yield exists

## Return posture

- Scheduler owns runtime progression, not user-facing surfacing.
- Before returning, reread written run-session state.
- The only legal scheduler handoff outcomes are:
  - a real stopped session with a real `stop_reason`
  - a live session with `yield_reason = dispatch_refresh_needed`
- The runner applies the `Execution Surface Protocol`; scheduler prose does not authorize a user-facing reply.

## Direct writes only

- `runs/<run_id>/session.json`
- `runs/<run_id>/modules/<module_id>.json`

## Hard rules

- Schedule from the combined DAG and dispatch weave, not from one module in isolation.
- Run `prepare-packet`, `settle-layer`, and `integrate-layer` locally in this same scheduler context; if their internal command entrypoints are used, they must stay in this same context and may not open sibling child agents.
- Dispatch producer children only as native OpenCode children for `task`, `craft`, `proof`, and `review` scopes, one packet per child.
- Writer scopes may still fan out normally, but proof and review scopes are fail-fast by default and should launch only the minimum ready set needed to make progress.
- After any proof or review raw attempt in a layer returns `partial` or `blocked`, do not launch untouched later sibling proof/review scopes in that layer.
- Create each producer child with a short `description`, an authoritative producer `prompt` that includes the packet path, the packet's `resolved_subagent_type` passed through OpenCode's native `subagent_type` parameter, and optional `command = producer_command` for audit only.
- Treat producer child agents as terminal leaves; do not expect nested built-in subtask dispatch from inside them.
- Treat producer children as leaf workers that hand back raw attempt truth, not as replacement schedulers or hidden planning surfaces.
- Preserve the packet's planning settings and resolved profile fields; do not silently reroute to another child agent or fallback model.
- Preserve the packet's `graph_revision_id`; do not dispatch a scope against a packet that lost its planning-revision pin.
- The child `command` field does not by itself execute the producer command file; the child prompt remains authoritative.
- If a packet cannot resolve or launch its approved child profile, fail closed instead of dispatching a fallback route.
- When a combined layer drains, run `settle-layer` before looking for any user-facing stop.
- When a module-layer gates to integration, run `integrate-layer` for that module before looking for any user-facing stop.
- Do not edit project files.
- Do not call MCP directly.
- Do not bootstrap or close the editor directly.
- Do not run compile or headless directly.
- Do not write authoritative evidence.
- Do not use `direct_thread` fallback in unattended mode.
- Do not speculatively burn an entire proof/review layer after the first decisive non-ready raw attempt already showed the layer cannot pass unchanged.
- Do not use `sleep`, passive polling, or wait-and-see behavior when no dispatched child scope is running.
- Do not directly hand-edit run-session JSON except through the local phase transitions explicitly assigned to this scheduler.
- Do not rewrite module state to `manual_needed` merely because producer dispatch has not yet been attempted.
- Do not relabel ordinary failed proof or implementation rework as `global_blocked`; reserve that stop reason for true environment or run-wide execution blockers.
- Do not relabel an eligible operator-executed proof handoff as `global_blocked`; use `manual_needed` only when the approved route still permits the same proof boundary through a concrete operator action after bounded automation attempts were honestly exhausted.
- Do not invent broader replanning inside the scheduler; if route, acceptance bar, module set, resources, or slot demand would need to change, stop at `replan_needed`.
- Do not reinterpret `repair_policy` as permission to author same-route delegated planning here. Even when lawful same-route delegated delta planning is enabled, this scheduler still stops at `replan_needed`; any such delegated planning belongs to the runner shell after that real stop.
- Do not use child self-report as authoritative stop or success truth without rereading runtime artifacts and raw attempt outputs.
- Do not run this scheduler inside a child agent or any host layer that would turn producer dispatch into second-level child dispatch.
- Do not own post-stop run-worker teardown; runner-level `cleanup-run-worktrees` handles that only after a real stopped iteration.
- Before any return, reread `runs/<run_id>/session.json` and every touched `runs/<run_id>/modules/<module_id>.json`; treat those files, not your last summary sentence, as the only authority for whether the run may stop.
- Returning while `current_phase = orchestrating` and `yield_reason = null` is invalid.
- When writing a real stopped session state here, clear any stale `continue_reason` and leave `resume_reason` truthful rather than carrying forward an active-continuation meaning into a stopped session.
- When writing `yield_reason = dispatch_refresh_needed`, also keep `continue_reason` truthful for the continuation path instead of leaving stale stop-era values in place.

## Mandatory loop

1. Read the run-session authority.
2. If the active epoch has admitted scopes without packets, run `prepare-packet` locally for them now.
3. If the active epoch has ready writer scopes without in-flight producers, dispatch them now through the matching producer prompt template and resolved child profile.
4. If the active admitted layer has ready proof/review scopes and no same-layer fail-fast trigger yet, dispatch only the minimum ready set now, normally one proof/review scope for that layer.
5. If producer child agents are in flight, wait only on those child agents.
6. If the admitted layer is fully returned or fail-fast-drained after a proof/review trigger, run `settle-layer` locally now.
7. If any settled layer is `rework_needed`, continue immediately if the current approved graph already contains a dispatchable repair continuation; otherwise write `current_phase = stopped`, `yield_reason = null`, clear stale `continue_reason`, and write `replan_needed` state for broader delta planning.
8. If any module-layer is gated to integration, run `integrate-layer` locally now.
9. Recompute the next epoch or layer.
10. If runnable work exists but this recovered root runner-owned scheduler context no longer has native producer-dispatch capability, clear any stale blocker caused only by that host limitation, keep `current_phase = orchestrating`, clear any stale `stop_reason`, set a truthful `continue_reason`, write `yield_reason = dispatch_refresh_needed`, and yield for runner-owned dispatch-capability refresh.
11. If the latest settled layer is `manual_needed`, write `current_phase = stopped`, `yield_reason = null`, clear stale `continue_reason`, and session/module manual-needed stop state instead of `global_blocked`.
12. Before any return, reread `runs/<run_id>/session.json` plus every touched module session and confirm the recorded state is either `current_phase = stopped` with a real `stop_reason` or `current_phase = orchestrating` with `yield_reason = dispatch_refresh_needed`.
13. Return only after the session itself records one of those two legal scheduler outcomes.

`dispatch_refresh_needed` is an internal runner yield, not a completed iteration boundary. Do not treat it as a cleanup point.

## Environment gate

1. Before the first producer dispatch, verify that the current execution context can write to the target repo root and its repo-local worktree paths and that no explicit contrary evidence shows this scheduler is already running inside a child agent or nested producer context.
2. Treat direct top-level use of the `run` surface in the current conversation as sufficient root-context evidence; lack of extra host metadata is not a blocker by itself.
3. If the current host layer is explicitly known to be a child agent that cannot legally own first-level producer dispatch, stop with an explicit execution-context blocker instead of looping on `dispatch_refresh_needed`.
4. If the write-capable execution context is absent, write a real environment blocker and stop without creating fake producer progress or fake packet-derived advancement.

## Consistency gate

- Reread `runs/<run_id>/session.json` and confirm it matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/session.schema.json`.
- Reread every touched `runs/<run_id>/modules/<module_id>.json` and confirm each matches `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/schemas/module-session.schema.json`.
- Confirm you never return control while `current_phase = orchestrating` still pairs with `yield_reason = null`.
- Confirm you did not leave a stale `continue_reason` that contradicts the written phase or stop state.
- Confirm you did not use `dispatch_refresh_needed` to mask the fact that the scheduler itself was running in a child agent or another non-root host layer.
- Confirm you did not treat historical `notes` text or stale `todo.json` status as live blocker truth when `session.json` and `modules/<module_id>.json` show active progress.
- Confirm you returned only a legal scheduler outcome for runner handling rather than improvising a user-facing reporting point.
