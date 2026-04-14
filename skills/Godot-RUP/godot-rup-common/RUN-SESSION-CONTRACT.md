---
title: Godot-RUP run-session contract
status: draft-rebuild
language: C#
---

# Godot-RUP Run-Session Contract

This document is the active authority for rebuilt execution and acceptance runtime behavior, phase ownership, live state semantics, and stop-policy rules.

High-frequency execution surfaces should prefer the narrower role-local common docs `RUNNER-RULES.md`, `SCHEDULER-RULES.md`, `DELTA-RULES.md`, and `RUNTIME-ARTIFACT-CONTRACT.md` instead of reopening this aggregate file by default.

Authority split:

- artifact paths, artifact families, and schema locations live in `HANDOFF-CONTRACT.md`
- skill and top-level surface boundary maps live in `HANDOFF-SKILL-SPEC.md`

Deprecated execution skills in the OpenCode deprecated skill bundle, if present, are reference only.

## 1. Runtime subtree

Execution and acceptance runtime state lives under:

- `<handoff_root>/runs/<run_id>/`

Approved planning truth remains outside the run session:

- `context/`
- `decision/`
- `graph/`
- `spikes/`

Before creating or resuming `runs/<run_id>/` for unattended execution, the runner shell must determine whether it is running from the root conversation context that can open first-level producer children.

Direct top-level use of the `run` surface in the current conversation counts as sufficient root-runner evidence unless explicit contrary evidence shows the surface is already running inside a child agent or nested producer context.

If that root-runner preflight fails on explicit contrary evidence, the runner must stop before mutating `runs/<run_id>/` at all. Do not create a doomed blocked run merely to record that the entry surface itself was invalid.

One run session is bound to the exact approved graph revisions of its requested modules.

- Resuming an existing run is valid only when every requested module's current active `graph/<module_id>.json.graph_revision_id` still matches that run's pinned `modules/<module_id>.json.graph_revision_id`.
- Resuming an existing run is also valid only when its `session.json.session_format` already matches the active session machine shape; older session formats must start a fresh run instead of being mutated in place.
- Resuming an existing run is also valid only when every requested `modules/<module_id>.json.module_session_format` already matches the active module-session machine shape; older module-session formats must start a fresh run instead of being mutated in place.
- If lawful same-route delegated delta planning supersedes the graph revision for any requested module, the runner must create a fresh `run_id` instead of resuming the older run subtree.
- Old attempts, settlements, module state, and stop reasons remain historical evidence for the older run and may not be reused as live state for the newer revision.

Authoritative proof remains outside the run session:

- `evidence/`

## 2. Run-session files

Required runtime files:

- `session.json`
- `scheduler-return.json`
- `combined-dag.json`
- `dispatch-weave.json`
- `slot-demand.json`
- `slot-table.json`
- `todo.json`
- `modules/<module_id>.json`

Run-local execution files:

- `packets/<module_id>/<scope_id>.json`
- `attempts/<module_id>/<scope_id>/<attempt_id>.json`
- `settlements/<module_id>/<layer_id>.json`
- `integrations/<module_id>/<layer_id>.json`
- `acceptance/<module_id>/dossier.json`

## 3. Object meanings

`session.json`

- authoritative live runtime truth for the run lives in `current_phase`, `yield_reason`, `stop_reason`, `stop_scope`, and `environment_blocker`
- `notes` are explanatory history only; they may preserve cleared blocker narratives and may not be treated as live blocker truth by themselves

`scheduler-return.json`

- runner-owned reverse-gate receipt for the most recent returned scheduler slice
- records whether that returned slice may surface to the user or must stay inside the unattended loop
- may not override `session.json`; it mirrors runner-shell judgment of the reread session state for one return boundary only

`todo.json`

- operator-readable progress view only
- not authoritative for stop-policy or blocker truth
- if `todo.json` lags behind `session.json` or `modules/<module_id>.json`, the latter files win

`modules/<module_id>.json`

- authoritative module-local live state lives in `status`, `active_layer_ids`, `current_epoch_id`, `pending_*` fields, and `open_blockers`
- `notes` are explanatory history only and may preserve cleared blocker narratives without reopening the blocker

- the runtime authority for one unattended run
- requested modules
- top-level entry-surface metadata plus the parent model
- current phase
- yield reason for runner-handled internal returns
- stop reason for real user-facing or terminal stops only
- `lineage_run_id` for the uninterrupted unattended route lineage
- `previous_run_id` when this run is a fresh successor rather than a lineage root
- active epoch ids
- environment blocker when execution context itself is insufficient

`combined-dag.json`

- the namespaced merged execution graph
- node ids use `<module_id>::<scope_id>`
- layer ids use `<module_id>::<layer_id>`
- it may merge multiple Modules into one runtime graph
- it may not rewrite any module-local dependency truth

`dispatch-weave.json`

- the runtime layer weave built from the combined DAG
- may offset later module layers in order to lower peak worker-slot demand
- records why a weave decision was chosen
- is runtime-only and does not mutate module-local graph approval
- weave operates at whole-layer granularity only
- weave may change when a module layer enters the combined schedule
- weave may not trim tasks out of an admitted layer
- weave is chosen by minimizing:
  - `peak worker-slot demand * combined topo DAG height`

`slot-demand.json`

- peak worker-slot demand from the weave
- fixed per-module integration-slot demand
- total worktree slots are peak worker slots plus one fixed integration slot per active module

`slot-table.json`

- fixed integration slot per active module
- global reusable worker slots shared across modules
- current occupant of each slot
- checkout path, branch, module, scope, and recycle status
- after a real execution-stage stop, a worker slot may remain as historical run truth with status `cleaned`
- after successful ship cleanup, an integration slot may remain as historical run truth with status `cleaned`

Constrained runtime resources:

- some environments may also expose singleton runtime resources such as a single-client MCP/editor bridge
- those are not worker slots, but they still impose hard one-at-a-time execution limits when planning truth marks a scope as requiring that resource
- runtime weave may not admit two scopes that need the same singleton runtime resource into the same admitted epoch
- if a single approved module layer already contains several scopes that need the same singleton runtime resource, runtime may not legalize that by partial admission; the graph must be replanned

`todo.json`

- one row per combined runtime layer or epoch
- lists namespaced scope ids for operator readability

`modules/<module_id>.json`

- run-local state for one module inside one run session
- status, including `accepted` after final acceptance promotion and `done` after shipping
- active `graph_revision_id` for the module in this run
- lineage-carried same-route delta bookkeeping such as `delta_attempt_count`, last result class, truthful superseded/new revision ids, and `delta_history_refs`
- `manual_needed` when the next legal step for that module is an explicit operator action inside the approved route
- active layer
- admitted scopes
- settled scopes
- pending review scopes
- pending integration layers
- readiness for acceptance
- last integration commit
- last mainline commit after explicit ship, when the module has reached `done`
- bounded same-route `recent_execution_learnings[]` for later packet preparation in this run

`attempts/...`

- raw, non-authoritative outputs from `run-task`, `run-craft`, `run-proof`, or `run-review`
- carry discriminator fields such as `scope_kind` and `producer_skill`
- must include `dispatch_audit` with requested versus actual child model and subagent values plus dispatch verification
- may include self-claim, logs, diff refs, raw check outputs, first blocker, optional `feedback_surface`, and optional structured `handoff_back`
- may not claim authoritative pass
- use a stable per-scope attempt id sequence such as `attempt-001`, `attempt-002`, ...; if no prior attempt exists for that scope, write `attempt-001`

`settlements/...`

- authoritative result for one layer after internal `attest` then `gate`
- may promote scopes from raw attempt to authoritative summary
- may move the layer to `review`, `integrate`, `rework_needed`, `manual_needed`, `blocked`, or `ready_for_acceptance`

## 4. Worktree model

Integration slots:

- one fixed repo-local integration worktree per active module
- path shape: `.worktrees/<module_id>/integration`
- the integration branch is the module-local assembly branch
- when first created, that integration branch starts from the approved project base branch discovered from active planning or context truth
- if the base branch name is missing, runtime must fail closed instead of guessing
- after successful explicit ship, `cleanup-worktrees` may remove that module's integration checkout and mark the slot as cleaned in `slot-table.json`

Worker slots:

- global reusable runtime capacity shared across modules
- path shape: `.worktrees/runs/<run_id>/worker-01`
- a worker slot may be reassigned from one module to another between scopes
- before each dispatch, the assigned worker slot is refreshed from the current tip of the target module's integration branch
- after smooth execution completion such as `ready_for_acceptance`, `cleanup-run-worktrees` should remove the current run's worker slot checkouts and mark those worker slots as `cleaned` before the stopped iteration is surfaced to the user
- after blocked or stalled execution stops such as `manual_needed`, `replan_needed`, or `global_blocked`, worker slots stay intact by default until a later runner-owned cleanup decision in a subsequent iteration
- if the same `run_id` later resumes while those worker slots were preserved, `allocate-worktrees` should refresh and reuse them in place
- if the same `run_id` later resumes after those worker slots were already cleaned, `allocate-worktrees` may reprovision cleaned worker slots at the same canonical paths
- a fresh or resumed later iteration may not silently treat another stopped run's preserved worker worktrees as its own active slot capacity; the runner must either resume that stopped run intentionally or clean it first

Combined epoch rules:

- an admitted epoch contains whole module layers, not partial layer fragments
- every admitted writer scope in that epoch must be dispatched
- proof and review scopes in an admitted layer are fail-fast by default; scheduler should dispatch the minimum ready set, normally one proof or review scope at a time per admitted layer, instead of speculatively launching the whole layer
- if any proof or review raw attempt in an admitted layer returns `partial` or `blocked`, scheduler may not launch untouched later sibling proof/review scopes in that same layer
- once any already-in-flight siblings from that layer have returned after such a fail-fast trigger, that layer counts as drained for settlement even if untouched proof/review siblings were intentionally withheld
- `worker_slots_required` therefore equals the number of admitted writer scopes in that epoch
- if admitting a module layer would exceed the target peak, move that whole layer later in the weave instead of partially admitting it

Acceptance checkout:

- when final acceptance proof truly needs isolation, `accept-module` may create a disposable local checkout
- path shape when used: `.worktrees/<module_id>/acceptance`
- this checkout is local to acceptance and is not counted in `slot-demand.json` or tracked in `slot-table.json`
- if such a disposable checkout still exists after successful ship, `cleanup-worktrees` may remove it as lingering cleanup

## 5. Authority split

`run-task`, `run-craft`, `run-proof`, and `run-review` are producers.

They may:

- edit only inside the assigned checkout and ownership boundary
- write only raw attempt artifacts

They may not:

- write authoritative pass into `evidence/`
- promote a layer
- integrate branches
- erase or rewrite failing raw logs

`settle-layer` is the first authority that may convert raw attempts into authoritative execution or review summaries.

`accept-module` is the only authority that may write the final module acceptance summary as acceptance-kind authoritative evidence with `scope_id = module-acceptance`.

## 6. Runtime phases, yield reasons, and stop reasons

Allowed `session.yield_reason` values:

- `null`
- `dispatch_refresh_needed`

Allowed `session.continue_reason` values:

- `null`
- `continue_normal`
- `continue_level1_repair`
- `continue_level2_graph_continuation`

Allowed `session.resume_reason` values:

- `null`
- `resume_after_manual`
- `resume_after_delta`
- `resume_after_legal_stop`

There is no same-run `continue_level3_delta_planning` reason.

Lawful same-route delegated delta planning happens only after a real `replan_needed` stop and resumes through a fresh lineage-successor run using `resume_after_delta`.

Allowed `session.stop_reason` values:

- `null`
- `manual_needed`
- `replan_needed`
- `ready_for_acceptance`
- `global_blocked`
- `all_done`

`current_phase = orchestrating` with `stop_reason = null` is the only valid live running state for unattended execution.

`dispatch_refresh_needed` is the only valid runner-handled `yield_reason` when runnable work still exists but the next producer dispatch needs a fresh runner-owned scheduler context.

It is valid only when the runner itself can reopen `orchestrate-runtime` from the root conversation context that owns first-level producer dispatch. It is not a license to keep the scheduler inside a child agent and loop on second-level dispatch failure.

`ready_for_acceptance` means execution is complete for the requested modules but the final acceptance workflow inside the top-level `accept` surface has not yet completed.

`accepted` means exact passing acceptance evidence was reread and the module is now cleared for an explicit ship gate; if the approved workflow required any acceptance-gating human review, that review also already passed.

`manual_needed` is valid for a real operator gate inside the approved route, including user answer, user approval, or operator-executed proof/action that the current automated environment still cannot perform after honest bounded automation attempts. It is not valid for scheduler indecision.

`replan_needed` is the required stop reason when unattended execution can no longer continue honestly inside the current same-route repair allowance.

This includes at least:

- the current approved graph has no legal continuation
- same-route delegated delta planning cannot preserve the required invariants
- counted same-route delta attempts have started looping instead of converging

`global_blocked` is the required stop reason when the session records an `environment_blocker` or another run-wide gate that prevents execution from advancing at all and no approved operator-action fallback exists inside the current route.

Failed proof, failed review, or ordinary code rework may not be relabelled as `global_blocked` merely because the scheduler cannot continue without a graph update.

Automated proof blocked by host limitations such as Wayland input-capture failure should first try honest bounded proof automation, including temporary helper scripts when appropriate, before falling back to `manual_needed`. If the same approved proof boundary truly still requires an explicit operator action after that attempt, stop at `manual_needed`, not `global_blocked`.

`all_done` means every requested module in the run has already completed separate acceptance and explicit ship/mainline integration.

## 6.0 Runner reverse gate

Runner surface semantics live in `EXECUTION-SURFACE-PROTOCOL.md`.

Receipt constraints:

- after every returned scheduler slice, `godot-rup-runner` rereads `session.json` plus touched module session files and writes `scheduler-return.json` from that reread truth
- `scheduler-return.json.next_action` may name only one legal runner action: `relaunch_orchestrate_runtime`, `surface_stop_to_user`, or `fail_closed_protocol_blocker`
- `scheduler-return.json` must be derived from reread `session.json` plus the touched module session files, never from scheduler prose alone.
- `return_allowed = true` is valid only when reread session truth says `current_phase = stopped` and `stop_reason` is a real stop reason.
- `return_allowed = false` is the normal outcome when reread session truth says `current_phase = orchestrating` and `yield_reason = dispatch_refresh_needed`.
- If a scheduler reply returns while reread session truth still says `current_phase = orchestrating` and `yield_reason = null`, the runner must mark the receipt `protocol_ok = false` and keep the return inside the unattended loop instead of surfacing it to the user.
- If a returned scheduler slice claims a user-facing stop but reread session truth does not show a real `stop_reason`, the runner must fail closed instead of pretending execution reached a valid stop.
- Absent or invalid `scheduler-return.json` never authorizes a user-facing stop.

## 6.1 Standard rework loop

- `settle-layer` may gate one drained layer to `rework_needed`; that is authoritative layer truth, not yet the final run stop reason.
- fail-fast proof/review dispatch is a token-protection rule, not partial layer admission: the layer remains the same approved layer even when untouched later proof/review siblings are withheld after a decisive non-ready raw attempt.
- After such a gate, `orchestrate-runtime` must check whether the already-approved graph still contains an undispatched, dependency-ready repair path that addresses the failing module without changing planning truth.
- If such a preapproved repair path exists, the scheduler continues unattended and dispatches it in the normal loop.
- If no such preapproved repair path exists, the scheduler must mark the affected module `status = replan_needed` and eventually stop the run with `current_phase = stopped`, `yield_reason = null`, and `session.stop_reason = replan_needed` rather than `global_blocked`.
- `session.stop_scope` should identify the failing module or layer that triggered the replan boundary.
- The standard same-route recovery path is: read authoritative failure evidence -> invoke `repair-delta-plan` only when approved `repair_policy` still allows same-route delegated delta planning -> if a lawful superseding planning revision is produced, start a fresh run for that newer revision -> recompute runtime composition -> resume execution.
- default repair posture remains `manual_only`; absent `repair_policy` does not authorize hidden same-route delegated replanning.
- same-route delegated delta planning is eligible only after a real stopped iteration with `session.stop_reason = replan_needed`
- after that real stop, the runner performs only a coarse admission reread from current artifacts to decide whether invoking `repair-delta-plan` is lawful to attempt at all
- that admission reread must also enforce the carried `repair_policy` result-class gates and the carried delta-count bound
- the persisted field name `repair_policy.max_same_route_delta_per_run` is interpreted against the uninterrupted unattended route lineage, not against one fresh run subtree in isolation
- before invoking `repair-delta-plan`, the runner must compare the affected module's truthful `delta_attempt_count` against `repair_policy.max_same_route_delta_per_run` and fail closed to visible `replan_needed` when the lineage bound is already exhausted
- that runner admission gate does not preclassify the result as `graph_delta_only` versus `blueprint_plus_graph_delta`
- the failure must remain local to one module; cross-module graph surgery is not eligible
- the repair must stay within the approved route and existing realization neighborhood cited by the failing graph and evidence
- the repair may not change `final_acceptance_expectations`, `acceptance_plan.required_evidence[]`, or any required `proof_rigor`
- the repair may not require new workflow steps, new decision gates, new co-layer exclusions, new singleton-resource assumptions, or broader slot-demand redesign
- the repair may not depend on user taste arbitration or a new user preference choice
- when `repair-delta-plan` returns a lawful non-escalation result, the runner must first update the stopped predecessor module session with truthful delta bookkeeping before creating any fresh successor run
- that bookkeeping must include incremented `delta_attempt_count`, the chosen result class, truthful trigger summary, truthful superseded/new revision ids, and a carried `delta_history_refs` chain that appends the stopped predecessor module-session path for successor-run inheritance
- once admitted, `repair-delta-plan` owns the finer planning judgment and result classification
- `repair-delta-plan` may return only `graph_delta_only`, `blueprint_plus_graph_delta`, or visible replanning escalation
- standalone `blueprint_only` is not a lawful result under the current artifact discipline
- if `repair-delta-plan` escalates to visible replanning, no fresh run is started and the runner surfaces the real `replan_needed` boundary instead
- counted same-route delta attempts must remain bounded across the route lineage; lawful fresh runs after delta must inherit prior counted history rather than resetting it
- if the runner judges that repeated counted delta attempts are looping instead of converging, or that the carried bound is exhausted, it must stop and surface visible `replan_needed`
- if any same-route eligibility point is uncertain, the runner must fail closed to visible `replan_needed`

## 6.2 Dispatch-capability refresh

- A recovered scheduler slice may occasionally retain runtime read/write authority but lose the host's native producer-child dispatch capability.
- That dispatch-capability loss is not a user-facing stop reason by itself.
- If runnable work still exists, the scheduler must clear any stale blocker or stop narrative that was caused only by lost dispatch capability, keep `current_phase = orchestrating`, clear `stop_reason`, and write `session.yield_reason = dispatch_refresh_needed`.
- In that case, `godot-rup-runner` must immediately write a reverse-gate receipt that requests relaunch, reopen `orchestrate-runtime` in a fresh runner-owned dispatch-capable context, and continue unattended.
- Asking the user for approval merely to bridge that context refresh is invalid unless a real `manual_needed` gate already exists in session truth.
- This refresh rule assumes the runner can reopen the scheduler from the root conversation context that owns first-level producer dispatch.
- If runtime was incorrectly invoked inside a child agent that cannot legally own first-level producer dispatch, repeated `dispatch_refresh_needed` is invalid; stop with an explicit execution-context blocker instead of looping.

## 6.3 Manual-proof handoff

- `settle-layer` may gate a layer to `manual_needed` when authoritative evidence shows the approved proof boundary is still correct but the remaining proof step now requires a concrete operator action rather than more code or broader replanning.
- Host-specific input/display restrictions become `manual_needed` only after bounded automation routes for the same proof boundary, including temporary helper scripts when appropriate, were honestly attempted or ruled out.
- In that case, `orchestrate-runtime` must stop the session with `current_phase = stopped`, `yield_reason = null`, `session.stop_reason = manual_needed`, set `session.stop_scope` to the affected module or layer, and preserve the required operator action in blocker/notes text.
- `global_blocked` is wrong for that case unless even the operator fallback is unavailable in the current route.

## 6.4 Smoke versus strict proof

- Approved proof-bearing claims carry explicit `proof_rigor` in planning truth.
- `smoke` is sanity-only proof and may demonstrate startup, wiring, or a basic happy path.
- `strict` is full-strength proof for the claim; for operator-visible behavior it should normally exercise adversarial or conflicting interactions, repeated sequences, and state churn rather than only one optimistic path.
- Runtime, settlement, review, and acceptance may not treat smoke evidence as satisfying a strict claim by implication.

## 7. Required discipline

- `godot-rup-runner` is the top-level runner shell only
- `orchestrate-runtime` is a scheduler only
- runner phases `compose-runtime-dag -> allocate-worktrees -> orchestrate-runtime` stay in one session context
- scheduler phases `prepare-packet -> child producer dispatch via the matching task/craft/proof/review producer prompt -> settle-layer -> integrate-layer` stay in one scheduler context
- matching same-context command entrypoints may exist for `prepare-packet`, `settle-layer`, and `integrate-layer`, but they do not change this one-context rule
- a runner-owned dispatch-capability refresh may reopen `orchestrate-runtime` in a fresh context while preserving the same run session; that is runner continuity, not a new user stop or a new planning phase
- the scheduler context is the `Root Runner Context`, not a child agent; `task` / `craft` / `proof` / `review` producers are the only first-level child agents in unattended execution
- after each scheduler slice returns, the runner must reread `runs/<run_id>/session.json`, reread touched `runs/<run_id>/modules/<module_id>.json`, write `runs/<run_id>/scheduler-return.json`, and branch only from that reread state plus receipt; scheduler chat prose is explanatory only
- before `orchestrate-runtime` yields control, it must reread `runs/<run_id>/session.json` plus every touched `runs/<run_id>/modules/<module_id>.json` and confirm the recorded state is either a real stop or a valid runner-handled yield
- producer child dispatch must preserve the packet's planned `model_tier` and `reasoningEffort` by using its resolved dispatch fields `resolved_subagent_type`, `resolved_model`, and `resolved_reasoningEffort`; packet path by itself is not enough dispatch authority
- producer child dispatch must also preserve the exact approved planning revision through packet `graph_revision_id`
- when the packet carries `source_realization_ids[]` and `blueprint_excerpt` as required by current-format blueprint-derived graph truth, producer execution must use that narrow but detail-rich realization-local planning context and its exact blueprint markdown anchor instead of reopening the whole execution blueprint by default
- producer child dispatch passes the packet's `resolved_subagent_type` into OpenCode's native `subagent_type` parameter, places the packet path plus producer instructions directly into the child prompt, and may mirror `producer_command` only as an audit label
- the child `command` field does not by itself execute the producer command file; the child prompt remains authoritative
- if the resolved child agent is unavailable, runtime must fail closed
- producer child contexts are terminal leaves for this runtime; nested built-in subtask dispatch is not available there
- MCP-consuming craft, proof, or review scopes own editor bootstrap and teardown locally; scheduler and packet glue may not require a separately pre-opened editor session as a hidden prerequisite
- project-file production belongs only to `run-task`, `run-craft`, and `run-proof`
- proof/review dispatch should protect token budget by failing fast instead of speculatively burning an entire proof layer after the first decisive non-ready raw attempt
- scheduler-owned runtime authority stops at `replan_needed`; any lawful same-route delegated delta planning belongs only to the runner shell after that real stop, and blocked-stop cleanup timing is runner-owned rather than scheduler-owned
- authoritative settlement belongs only to `settle-layer`
- per-module execution integration into the module integration branch belongs only to `integrate-layer`
- explicit ship/mainline integration after acceptance belongs only to `integrate-main`
- `integrate-main` is the only authority that may set a module state to `done`, record `last_mainline_commit`, or move the run session to `all_done`
- post-ship worktree removal belongs only to `cleanup-worktrees`
- post-execution run-worker cleanup belongs only to `cleanup-run-worktrees`
- final module acceptance belongs only to `accept-module`
- passive waiting without in-flight producer children is forbidden
- the runner may not surface a final answer before `scheduler-return.json` authorizes the return and a real `stop_reason` is recorded
- producer dispatch requires a valid execution context that can write to the target repo and its repo-local worktrees
- if that execution context is absent, the session must record an explicit environment blocker instead of fabricating producer progress
- failed proof or failed review that requires more implementation may not be rewritten as `global_blocked`; if no preapproved path exists, scheduler must stop at `replan_needed`
- stale `global_blocked` or approval-seeking narration caused only by temporary loss of dispatch capability is invalid once runnable scopes exist again; the runner must refresh the scheduler context and continue
- returning control while `current_phase = orchestrating` and `yield_reason = null` is invalid; use a real stop reason or the explicit runner-handled yield reason
- automated proof blocked by a host limitation should first try bounded automation for the same approved proof boundary; only when an approved operator-executable fallback is still genuinely required should it stop at `manual_needed`, not `global_blocked`
