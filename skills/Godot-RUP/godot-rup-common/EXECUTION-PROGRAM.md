---
title: Godot-RUP execution hard program
status: draft-rebuild
language: C#
---

# Godot-RUP Execution Hard Program

This document defines the rebuilt execution-stage procedure.

High-frequency execution surfaces should prefer the narrower role-local common docs `RUNNER-RULES.md`, `SCHEDULER-RULES.md`, and `DELTA-RULES.md` instead of reopening this aggregate file by default.

The only legal user-facing transition after a returned scheduler slice is defined in `EXECUTION-SURFACE-PROTOCOL.md`.

## 1. Runner sequence

`godot-rup-runner` may do only this:

1. treat direct top-level use of the `run` surface in the current conversation as sufficient evidence that this is the `Root Runner Context`; fail before creating or resuming any run session only if explicit evidence shows the surface is already running inside a child agent or nested producer context
2. resolve the active handoff root and requested modules
3. open or create `<handoff_root>/runs/<run_id>/`, but reuse only when the candidate run's pinned module `graph_revision_id` values still match the active approved graphs, its `session.json` already matches the active session machine shape, and its requested `modules/<module_id>.json` files already match the active module-session machine shape; otherwise create a fresh run
4. as soon as the concrete `run_id` is known for a created or resumed unattended run, register that run with local continuation enforcement
5. run `compose-runtime-dag` locally in the current session context
6. run `allocate-worktrees` locally in the current session context
7. run `orchestrate-runtime` locally in the current `Root Runner Context` that can open first-level producer children directly; do not host the scheduler inside a child agent
8. after each `orchestrate-runtime` return, reread `<handoff_root>/runs/<run_id>/session.json` plus any touched `modules/<module_id>.json`, then write `<handoff_root>/runs/<run_id>/scheduler-return.json` as the runner-owned reverse-gate receipt
9. execute only the receipt's `next_action` under `EXECUTION-SURFACE-PROTOCOL.md`
10. if `next_action = relaunch_orchestrate_runtime`, immediately relaunch `orchestrate-runtime` in a fresh root runner-owned dispatch-capable context and keep the run unattended
11. if `next_action = surface_stop_to_user`, apply the stop-type handling and continuation rules from `RUN-SESSION-CONTRACT.md`
12. if that handling converts the candidate stop into an internal continuation, keep the run unattended and loop from the appropriate runner phase instead of surfacing yet
13. if `next_action = fail_closed_protocol_blocker`, stop without pretending runtime reached a valid user-facing domain stop
14. report a final user-facing result only when the protocol still leaves `surface_stop_to_user` as the correct action after stop-type handling

Stop-type specifics such as blocked-stop cleanup deferral, same-route delegated delta planning, and delta-loop stopping remain in `RUN-SESSION-CONTRACT.md`.

Clarification:

- A runner-level instruction such as "use only `compose-runtime-dag`, `allocate-worktrees`, and `orchestrate-runtime`" constrains only the runner shell's top-level phase selection.
- It does not prohibit `orchestrate-runtime` from invoking its documented scheduler-local dependencies such as `prepare-packet`, `run-task`, `run-craft`, `run-proof`, `run-review`, `settle-layer`, and `integrate-layer`.
- It also does not prohibit the runner from invoking `repair-delta-plan` after a real `replan_needed` stop when approved `repair_policy` still allows lawful same-route delegated delta planning and the carried lineage delta bound is not exhausted.
- Treating that runner-level restriction as a ban on the scheduler's internal phases is a runner error.
- A command bridge or automation wrapper that launches execution inside a child agent is not a valid `Root Runner Context` for unattended execution.
- Lack of an extra machine-readable host-layer proof is not by itself evidence that the direct top-level run surface is non-root.

`godot-rup-runner` may not:

- edit project files
- reuse an older run subtree after lawful same-route delegated delta planning changed any requested module's `graph_revision_id`
- call MCP directly
- run compile or headless directly
- write authoritative evidence directly
- settle layers
- integrate layers
- own domain stop-policy decisions beyond relaying reread session truth through the runner reverse gate
- spawn sibling subagents for runtime phase skills outside the scheduler and producer rules
- ask the user for approval merely because a scheduler slice needs a dispatch-capability refresh while session truth is still `current_phase = orchestrating`
- ask the user for approval merely because lawful same-route delegated delta planning is needed inside unattended execution
- ignore `repair_policy` result-class gates or the carried lineage delta bound when deciding whether to invoke `repair-delta-plan`
- accept a returned scheduler slice that left `current_phase = orchestrating` without a valid runner-handled yield reason
- branch on scheduler chat prose instead of rereading `session.json` after each scheduler slice
- host `orchestrate-runtime` inside a child agent or any context that would require second-level producer dispatch
- start or mutate a run session when explicit contrary evidence shows the current invocation surface is not the required root runner context
- self-block a direct user-invoked run surface merely because it lacks out-of-band proof of root host metadata
- override the stop-type handling, cleanup timing, or delegated repair guards defined in `RUN-SESSION-CONTRACT.md`

## 2. Scheduler sequence

`orchestrate-runtime` may do only this:

1. load `session.json`, `dispatch-weave.json`, `slot-table.json`, and `modules/*.json`
2. identify the next admitted combined layer or epoch
3. run `prepare-packet` locally for every ready scope that lacks a run-local packet
4. dispatch only child subagents for `task`, `craft`, `proof`, or `review` scopes, one packet per child
5. wait only for in-flight child scopes that this scheduler already dispatched
6. run `settle-layer` locally when an admitted layer drains, including fail-fast drain after a decisive proof/review failure boundary
7. when a drained layer gates to `rework_needed` and no preapproved repair continuation exists, stop with `current_phase = stopped`, `yield_reason = null`, and `stop_reason = replan_needed`; any same-route delegated delta planning belongs to the runner shell after that stop, and result-class judgment belongs to `repair-delta-plan`, not to the scheduler here
8. for every module-layer gated to integration, run `integrate-layer` locally for that module only
9. before any return, reread `session.json` plus every touched `modules/<module_id>.json` and confirm the recorded state is either `current_phase = stopped` with a real `stop_reason` or `current_phase = orchestrating` with `yield_reason = dispatch_refresh_needed`
10. any real stop written here must set `current_phase = stopped`, `yield_reason = null`, and the real `stop_reason`; otherwise recompute and continue until a reverse-gate-legal return state exists

This scheduler must run only in the `Root Runner Context`. Producer `task` / `craft` / `proof` / `review` children are first-level children from that root. Running the scheduler inside a child agent is invalid because it turns producer dispatch into forbidden second-level child dispatch. When the top-level `run` surface was directly used by the user in the current conversation, runtime should assume that root context unless explicit contrary evidence exists. The runner owns the surface protocol and decides whether a returned scheduler slice may surface to the user.

Concrete producer dispatch payload:

- task scope: child `prompt` carries the packet path plus the canonical `godot-rup-task` producer instructions; optional `command = godot-rup-task` is audit-only
- craft scope: child `prompt` carries the packet path plus the canonical `godot-rup-craft` producer instructions; optional `command = godot-rup-craft` is audit-only
- proof scope: child `prompt` carries the packet path plus the canonical `godot-rup-proof` producer instructions; optional `command = godot-rup-proof` is audit-only
- review scope: child `prompt` carries the packet path plus the canonical `godot-rup-review` producer instructions; optional `command = godot-rup-review` is audit-only
- writer scopes may still fan out across the admitted epoch, but proof/review scopes are fail-fast by default and should launch only the minimum ready set needed to make progress
- after a proof/review raw attempt in a layer returns `partial` or `blocked`, do not launch untouched later sibling proof/review scopes in that layer; wait only for already-launched siblings, then settle the layer
- every child also receives a short `description` and the packet's `resolved_subagent_type` through OpenCode's native `subagent_type` parameter
- the child prompt, not the child `command` field, is authoritative for producer behavior
- packet preparation must already have resolved the joint dispatch pair `model_tier + reasoningEffort` into `resolved_subagent_type`, `resolved_model`, and `resolved_reasoningEffort`; current active normalization is `mini + medium -> godot-rup-exec-mini-high`
- packet preparation must also pin the exact planning source through `graph_revision_id`
- current-format graph truth must carry execution-blueprint realization linkage, and packet preparation must project `source_realization_ids[]` plus a narrow but detail-rich `blueprint_excerpt` with an exact blueprint markdown path and line slice so producer children do not need the full blueprint artifact by default
- producer execution must respect packet-declared `proof_rigor`; a smoke sanity run may not be reported as if it satisfied a strict proof obligation
- if the resolved child agent is unavailable, runtime must fail closed before dispatch

`orchestrate-runtime` may not:

- edit project files
- use `apply_patch`
- call MCP directly
- own editor bootstrap or teardown directly
- run compile or headless directly
- write authoritative pass into `evidence/`
- use direct-thread fallback in unattended mode
- record or accept `direct_thread` as active unattended runtime truth
- speculatively fan out an entire proof/review layer when one early non-ready result would already make later siblings wasteful
- sleep or poll the filesystem when no child scope is in flight
- use ad hoc Python, shell heredocs, or one-off scripts to fabricate packets, attempts, settlements, integrations, or stop reasons
- mark `manual_needed` before producer dispatch was genuinely attempted or a real environment gate was recorded
- assume a producer child can launch another built-in subtask; OpenCode child contexts do not expose nested subtask dispatch here
- use `godot-rup-prepare-packet`, `godot-rup-settle-layer`, or `godot-rup-integrate-layer` in a way that opens sibling child agents; those entrypoints, when used, stay in the scheduler's current context
- dispatch a deleted top-level command surface or bare command label instead of the matching producer prompt contract
- rely on the child `command` field to execute the producer instructions automatically
- drop the packet's resolved dispatch fields when creating a producer child
- leave a stale `global_blocked` or approval-seeking reply in place after runnable repair work exists again
- relabel an eligible manual-proof handoff as `global_blocked` merely because the automated environment could not complete it
- write `scheduler-return.json`; that receipt is runner-owned
- own post-stop run-worker teardown; that belongs to runner-level `cleanup-run-worktrees`

## 3. Scope producers

`run-task`

- produces code or content changes for one execution scope
- may do cheap local self-checks
- writes only raw attempt output
- normally runs through a native child prompt equivalent to the canonical `godot-rup-task` instructions; runtime may mirror `command = godot-rup-task` for audit
- is a terminal producer child in practice; do not expect nested producer dispatch from inside it

`run-craft`

- produces editor or MCP-backed implementation convergence for one craft scope
- writes only raw attempt output
- owns editor bootstrap and teardown when that craft scope actually requires MCP
- normally runs through a native child prompt equivalent to the canonical `godot-rup-craft` instructions; runtime may mirror `command = godot-rup-craft` for audit
- is a terminal producer child in practice; do not expect nested producer dispatch from inside it

`run-proof`

- produces compile, headless, MCP, fixture, or harness proof for one proof scope
- may use bounded disposable helpers, including temporary Python scripts, when that is the honest way to execute the approved proof boundary in the current environment
- writes only raw attempt output
- owns editor bootstrap and teardown when that proof scope actually requires MCP
- normally runs through a native child prompt equivalent to the canonical `godot-rup-proof` instructions; runtime may mirror `command = godot-rup-proof` for audit
- is a terminal producer child in practice; do not expect nested producer dispatch from inside it

`run-review`

- judges one selected review scope
- writes only raw review attempt output
- owns editor bootstrap and teardown when that review scope actually requires MCP
- normally runs through a native child prompt equivalent to the canonical `godot-rup-review` instructions; runtime may mirror `command = godot-rup-review` for audit
- is a terminal producer child in practice; do not expect nested producer dispatch from inside it

None of these four may write authoritative pass.

## 4. Layer settlement

Same-context internal command entrypoints may exist for scheduler-local phases:

- `godot-rup-prepare-packet` for one packet preparation
- `godot-rup-settle-layer` for one drained layer settlement
- `godot-rup-integrate-layer` for one gated module-layer integration

Using those entrypoints does not change authority boundaries or permit child dispatch for these phases.

Dispatch-capability refresh:

- if a recovered scheduler slice in the `Root Runner Context` can no longer open native producer children but runnable work still exists, it must return control without treating that condition as a real user stop
- the scheduler must keep `session.current_phase = orchestrating`, clear any stale `stop_reason`, write `session.yield_reason = dispatch_refresh_needed`, and then yield control for that refresh
- the runner then follows `EXECUTION-SURFACE-PROTOCOL.md`; for a legal dispatch refresh that means `next_action = relaunch_orchestrate_runtime` and immediate unattended continuation
- successful same-route delegated delta planning should later create new ready scope(s) through a fresh planning pass; the next action after that is ordinary resumed producer dispatch, not user approval in the scheduler chat
- after lawful same-route delegated delta planning changed a module graph revision, resumed execution must start from a fresh run rather than reusing stale `session.json`, `combined-dag.json`, `dispatch-weave.json`, or settled scope history from the older revision
- that fresh successor run must preserve the route lineage id and inherit truthful same-route delta bookkeeping from the stopped predecessor before new worker/module sessions are seeded
- `dispatch_refresh_needed` is not a license to host the scheduler inside a child agent and bounce forever between child-owned scheduler slices; if the current host layer itself cannot ever own first-level producer dispatch, runtime must stop with an explicit execution-context blocker instead
- `dispatch_refresh_needed` is not a real iteration boundary and may not trigger `cleanup-run-worktrees`

`settle-layer` runs in two hard internal phases inside one context:

1. `attest`
2. `gate`

`attest`

- reads the drained layer's raw attempts
- runs only minimal settlement-local consistency checks and proof aggregation from already-produced outputs
- writes authoritative scope summaries into `evidence/`
- records `pass`, `rework_needed`, or `blocked` for the settled scopes
- may settle a fail-fast-drained layer from the returned raw attempts plus approved graph truth without fabricating missing raw attempts for untouched proof/review siblings that were intentionally withheld

`gate`

- reads only approved graph truth plus the just-written authoritative summaries
- decides whether the layer goes to:
  - `review`
  - `integrate`
  - `rework_needed`
  - `ready_for_acceptance`
  - `manual_needed`
  - `blocked`

`settle-layer` may not integrate branches.

Manual-proof handoff:

- choose `manual_needed` only when the approved proof boundary still stands and the remaining proof step still requires a concrete operator action after bounded automation for that same proof boundary was honestly attempted or ruled out
- Wayland/display/input restrictions should first trigger bounded automation attempts, such as temporary Python input-driving helpers, before falling back to `manual_needed`
- do not choose `global_blocked` for that case unless no approved operator fallback exists and runtime truly cannot advance at all

Rework handoff:

- `rework_needed` is a layer-local settlement outcome, not by itself the final session stop reason
- after a layer gates to `rework_needed`, the scheduler must decide whether an already-approved repair path still exists in the current graph
- if such a repair path exists, unattended execution continues normally
- if no such repair path exists, the scheduler must stop with `current_phase = stopped`, `yield_reason = null`, `session.stop_reason = replan_needed`, and `session.stop_scope` pointed at the failing module or layer
- ordinary failed proof or code repair gaps may not be relabelled as `global_blocked`; `global_blocked` remains reserved for environment or run-wide execution blockers

Manual-needed handoff:

- if a settled layer gates to `manual_needed`, the scheduler must stop with `current_phase = stopped`, `yield_reason = null`, and `session.stop_reason = manual_needed`
- the stop narrative must name the required operator action instead of pretending the run is globally blocked

Smoke versus strict proof:

- `smoke` is sanity only; it proves startup, wiring, or a basic happy path
- `strict` is full-strength proof; for behavior claims it must pressure the behavior beyond a single optimistic path
- runtime may execute smoke checks as auxiliary signals, but settlement and later acceptance may not let them satisfy a strict claim by implication

## 5. Integration

`integrate-layer` is per-module only.

`integrate-layer` must:

- operate on one `module_id + layer_id`
- merge only into `.worktrees/<module_id>/integration`
- record the real resulting commit hash
- recycle freed worker slots

`integrate-layer` may not:

- perform combined multi-module merge
- claim integration without git state change

## 6. Unattended rule

Intermediate success is never a stop reason.

The runtime must continue while any of these remain possible inside the current active scheduler slice:

- more runnable scopes in the current or next admitted epoch
- layer settlement
- module-layer integration
- module promotion to `ready_for_acceptance`
- already-approved repair scopes after a `rework_needed` settlement

If live session truth still says `current_phase = orchestrating`, it must either:

- dispatch the next scope
- settle the next drained layer
- integrate the next gated module-layer
- write `yield_reason = dispatch_refresh_needed` when a fresh runner-owned dispatch context is required for the next producer dispatch
- stop with `replan_needed` when a settled `rework_needed` layer has no approved repair continuation in the current graph
- or write a real blocking stop reason

It may not emit a summary that merely says no meaningful stop reason was produced.

Runner post-slice surfacing and cleanup timing are defined by `EXECUTION-SURFACE-PROTOCOL.md` plus `RUN-SESSION-CONTRACT.md`, not by the scheduler's prose summary.

Environment gate:

- unattended execution may start only in a session context whose writable roots include the target repo and its repo-local worktree paths
- that execution context must also be the `Root Runner Context` that can open first-level producer children directly
- if that context is missing, scheduler must stop immediately with `session.stop_reason = global_blocked` and an explicit environment blocker
- scheduler may not fake progress by preparing packets and then relabelling the run as `manual_needed` without ever attempting producer dispatch in a valid execution context
