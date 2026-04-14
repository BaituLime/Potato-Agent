---
title: Godot-RUP workflow terms
status: active-rebuild
language: C#
---

# Godot-RUP Workflow Terms

## Top-level workflow terms

- `Phase`: one top-level authority zone. Only `Planning`, `Execution`, and `Acceptance` are top-level phases.
- `Slice`: one internal workflow unit inside a top-level phase; it is not a top-level authority zone.
- `Gate`: one decision point that allows or blocks progression.
- `State`: one live runtime or machine condition; it is not the same thing as a top-level phase.
- `plan`: the top-level planning surface owned by `godot-rup-planner`.
- `run`: the top-level execution surface owned by `godot-rup-runner`.
- `accept`: the top-level acceptance surface owned by `godot-rup-acceptor`.
- `Runner Shell`: the top-level Godot-RUP execution surface that owns unattended execution continuity, legal stop surfacing, and reread-before-continue discipline while remaining subordinate to planning law, acceptance law, and handoff truth.
- `Root Runner Context`: the main assistant conversation context that owns the top-level `run` surface and can open first-level producer children directly.

## Planning terms

- `Context Handoff`: stable project facts and tool discovery
- `Use-Case Design`: approved operator-facing use-case contract at authoritative `use-cases/<module_id>.md` with companion index `use-cases/<module_id>.json`, sitting after context discovery and before architecture review
- `Decision Handoff`: approved route, constraints, done semantics, and acceptance plan
- `Blueprint Draft`: the current non-authoritative draft pair at `blueprint/<module_id>.draft.md` and `blueprint/<module_id>.draft.json`, written before blueprint gate approval and promoted away after approval
- `Blueprint Draft Review`: one strict non-authoritative review of a blueprint draft, written to `/tmp/godot-rup-blueprint-review/<module_id>.md` and used as a real gate input before any `DG-BLUEPRINT-*` recommendation
- `Execution Blueprint`: approved implementation-route rehearsal at authoritative `blueprint/<module_id>.md` with companion index `blueprint/<module_id>.json`, sitting after approved use-case design and approved route but before workflow/DAG compilation
- `Key Use Case`: one operator-meaningful scenario approved in `Use-Case Design` before technical route selection begins
- `Acceptance-Sensitive Behavior Claim`: one explicit behavior truth that later proof or acceptance must be able to judge as real, not infer from structure alone
- `Implementation Route Step`: one authoritative prose preplay for one decisive implementation cut inside the markdown blueprint
- `Shared Route Decision`: one implementation decision that only becomes obvious after the implementation route is understood together
- `Realization Id`: one stable downstream reference anchor assigned to an implementation route step or a derived convergence route so `dag-plan` can cite blueprint truth without treating the companion index as the primary narrative
- `Derived Parallelization And Convergence`: the part of the blueprint that records which rehearsed routes truly unlock parallel work and where they must converge back
- `Graph Handoff`: approved module-local DAG with MVP-bounded task split, dependency truth, parallelism hints, and per-scope dispatch settings
- `Decision Gate`: an explicit user approval checkpoint before planning truth may advance
- `Experiential Acceptance Bar`: the planning-owned statement of what later acceptance must verify as real operator-visible behavior rather than infer from structure alone
- `Atomic Task`: the smallest independently reviewable and verifiable module-local execution or proof unit written into the approved graph
- `MVP Slice`: the smallest task split that still produces meaningful progress toward the approved route
- `Atomic Task DAG`: the approved module-local dependency graph of `Atomic Task` nodes
- `Red Topo Layer`: a dependency-ready execution planning layer before review insertion
- `Black Topo Layer`: a review-layer view formed after review targets are selected
- `DG-USE-CASE-*`: the use-case-design gate entry family that records the approved key use cases and acceptance-sensitive behavior claims for one module
- `DG-BLUEPRINT-*`: the execution-blueprint gate entry family that records the approved implementation route, coverage against approved use-case design, shared route decisions, and derived parallelization/convergence for one module
- `DG-GRAPH-*`: the `Decision Handoff` gate entry family that records graph-shape review and approval state for one module
- `Dispatch Pair`: the planning-owned joint selection `model_tier + reasoningEffort` for one scope; it must be judged together as one cost/risk/context choice rather than as two independent knobs
- `proof_rigor`: the planning-owned declared evidence strength for one required proof input; allowed values are `smoke` and `strict`
- `Smoke Check`: a cheap sanity-oriented proof step that shows startup, wiring, or a basic happy path. It may support debugging or readiness, but it may not substitute for strict proof unless planning truth explicitly says `proof_rigor = smoke` for that exact evidence claim.
- `Strict Proof`: full-strength evidence for a claim. For operator-visible behavior this is falsification-oriented, not optimistic: it should pressure the behavior with adversarial or conflicting interactions, repeated sequences, state churn, and relevant failure-path handling rather than only a single happy path.
- `Optimistic Smoke Substitution`: an invalid downgrade where a smoke check, happy-path run, or bootstrap-only probe is presented as if it satisfied a strict proof obligation.
- `Graph Revision`: one immutable approved DAG revision for a module; the latest approved graph stays at `graph/<module_id>.json`, while prior revisions are archived under `graph-history/<module_id>/`
- `Repair Continuation`: a same-module set of follow-up scopes that fixes an authoritative `rework_needed` failure and reruns the required proof/review without changing the approved route or acceptance bar
- `Repair Policy`: planning-owned rule for what may happen after authoritative `rework_needed` when no preapproved repair continuation exists. `manual_only` means execution stops visibly at `replan_needed`. A lawful same-route delta-planning allowance means the runner may invoke `repair-delta-plan` inside unattended execution as long as use-case truth, route truth, acceptance bar, and `proof_rigor` remain unchanged.
- `Delta Planning`: same-route delegated planning used only after a real `replan_needed` stop and only while the approved use-case truth, route truth, acceptance bar, and `proof_rigor` still remain unchanged.
- `Delta Admission Gate`: the runner-owned coarse reread judgment performed only after a real `replan_needed` stop to decide whether invoking `repair-delta-plan` is lawful to attempt at all. It does not preclassify the result as `graph_delta_only` versus `blueprint_plus_graph_delta`.
- `repair-delta-plan`: the planning skill that authors lawful same-route delta planning inside unattended execution. It is not a general replanning skill and it is not a user-approval stop by itself.
- `graph_delta_only`: lawful same-route delta-planning result class that supersedes graph truth only because the blueprint remains sufficient.
- `blueprint_plus_graph_delta`: lawful same-route delta-planning result class that supersedes blueprint truth and graph truth together because execution exposed insufficient same-route blueprint detail.
- `Same-Route Repair Eligibility`: the checklist that keeps delegated same-route delta planning bounded. The runner uses it as the admission gate after a real `replan_needed` stop, while `repair-delta-plan` performs the finer result-class judgment after admission. If any admission point is uncertain, the route fails closed to visible replanning.
- `Dispatch-Capability Refresh`: relaunching `orchestrate-runtime` from a fresh root runner-owned context when a recovered scheduler slice can still read/write runtime state but can no longer open native producer children
- `model_tier`: planning-owned model-size choice for one scope; allowed values are `full` and `mini`
- `reasoningEffort`: planning-owned OpenCode reasoning-budget choice for one scope; allowed values are `medium`, `high`, and `xhigh`
- `Parallelism Hint`: planning-owned indication of which task groups may safely run together when no real dependency or mutual exclusion blocks them
- `Acceptance Support Scope`: execution work inside the DAG that produces real proof inputs for later final acceptance
- `Spike Record`: optional planning-stage temporary validation for one technical uncertainty; it may inform later decisions but is not final module acceptance evidence by itself
- `Proof Scope`: a DAG task whose primary job is to generate evidence rather than to judge it
- `Blueprint Excerpt`: the task-local packet projection of approved realization-level blueprint truth so producer children can stay narrow while still inheriting the preplayed implementation details they need
- `Contract-First Read`: the rule that canonical `godot-rup-common/*.md` docs plus active schemas outrank any older handoff artifact, copied prompt pattern, or stale local format memory; existing handoff files are inputs, not workflow-law replacements

## Runtime terms

- `Run Session`: one execution or acceptance runtime under `runs/<run_id>/`
- `Combined Runtime DAG`: the namespaced runtime graph formed from multiple approved module-local DAGs
- `Dispatch Weave`: the runtime-only layer weave used to lower peak worker-slot demand
- `Dispatch Weave` works by moving whole module layers later or earlier relative to other module layers; it does not cut tasks out of an admitted layer
- `Dispatch Weave` is chosen by minimizing `peak worker-slot demand * combined topo DAG height`
- `Epoch`: one admitted combined runtime wave containing whole admitted module layers
- `Writer Scope`: a `task` or `craft` scope that produces implementation changes inside the assigned checkout
- `Fail-Fast Proof Dispatch`: the runtime rule that proof/review scopes should be launched in the minimum ready set, normally one at a time per admitted layer, and that later untouched sibling proof/review scopes should not be launched after the first same-layer raw attempt returns `partial` or `blocked`
- `Integration Slot`: one fixed per-module integration worktree
- `Worker Slot`: one global reusable writer worktree
- `Acceptance Checkout`: one disposable per-module acceptance checkout used only by `accept-module` when final proof truly needs it; it is not a shared slot-table resource
- `cleanup-run-worktrees`: the runner-owned cleanup skill that removes run-scoped worker worktrees when a stopped execution run should actually be torn down; smooth completion normally cleans immediately, while blocked stops default to deferred cleanup until a later iteration decides whether to retain or retire that stopped run
- `cleanup-worktrees`: the post-ship skill that removes no-longer-needed module worktrees and records cleanup state after `integrate-main` already succeeded
- `resolved_subagent_type`: runtime-resolved OpenCode child-agent id selected from the active custom execution-profile table for one scope
- `producer_command`: logical producer label mirrored into the optional native-child `command` field for audit; the child prompt remains authoritative
- `yield_reason`: runner-handled internal return reason recorded in `session.json` while the run is still active; it is not a user-facing stop reason
- `Legal Stop Reason`: one explicit reason that authorizes the runner shell to stop and surface to the user. Ordinary friction, uncertainty, or idle drift do not count.
- `Continue Reason`: one explicit internal reason recorded when unattended execution continues rather than surfacing to the user.
- `Resume Reason`: one explicit internal reason recorded when unattended execution resumes after a lawful stop or recovery boundary.
- `Scheduler Return Receipt`: the runner-owned `scheduler-return.json` artifact that records whether a returned scheduler slice may surface to the user or must stay inside the unattended loop
- `Delta Attempt Count`: the counted number of same-route delegated delta-planning attempts recorded for the current unattended execution route so the runner can detect looping instead of treating every delta as a fresh first attempt.

## Scope terms

- `Task Scope`: a bounded ordinary implementation-producing runtime scope
- `Craft Scope`: a bounded Godot interactive implementation scope that may use editor or MCP-backed feedback to converge UI, scene, animation, or interaction work before final proof
- `Proof Scope`: a bounded compile, headless, MCP, fixture, or harness-producing runtime scope
- `Review Scope`: a bounded selected review scope
- `kind`: semantic task-role metadata for execution/craft/proof/review classification; it is not part of the dispatch pair and may not substitute for `reasoningEffort`
- `scope_kind`: packet/attempt discriminator for runtime scope class; allowed values are `task`, `craft`, `proof`, and `review`
- `graph_kind`: packet discriminator for the planning graph role that produced the scope; allowed values are `execution`, `craft`, `proof`, and `review`
- `producer_skill`: raw-attempt discriminator naming the producer that wrote the attempt; allowed values are `run-task`, `run-craft`, `run-proof`, and `run-review`
- `Run Packet`: one run-local dispatch packet for one scope
- `Raw Attempt`: producer output from `run-task`, `run-craft`, `run-proof`, or `run-review`
- `Layer Settlement`: one drained layer's two-stage closure: `attest` then `gate`
- `Integration Record`: one per-module layer integration action
- `Acceptance Dossier`: the collected final module acceptance bundle
- `Human Review Plan`: the planning-owned acceptance subplan that decides whether experience review and/or tech-lead review are required, and whether either one gates final acceptance
- `Human Review Brief`: the optional structured guided-review guide at `runs/<run_id>/acceptance/<module_id>/human-review-brief.json` when `human_review_plan` requires at least one review track
- `Human Review Record`: the optional recorded explicit human-review result at `runs/<run_id>/acceptance/<module_id>/human-review-record.json` when `human_review_plan` requires at least one review track
- `Acceptance Summary`: the final module acceptance artifact at `evidence/<module_id>/module-acceptance/summary.json`, written in evidence-summary shape with `kind = acceptance`

## State terms

- `ready_for_attest`: a producer claims the scope is ready for layer settlement
- `partial`: a producer completed only scaffold or incomplete proof
- `blocked`: a producer or layer hit a real blocker
- `pass`: authoritative scope result written after settlement
- `rework_needed`: authoritative result meaning the approved route still stands but more execution is required
- `replan_needed`: module or session state meaning unattended execution can no longer continue honestly inside the current same-route repair allowance. This may happen because the approved graph has no legal continuation, because same-route delta planning cannot preserve the required invariants, or because counted delta attempts have started looping instead of converging.
- `dispatch_refresh_needed`: the internal runner-handled `yield_reason` meaning runnable work still exists, but a fresh dispatch-capable scheduler context must be opened before producer dispatch can continue
- `manual_needed`: layer/session state reserved for a real operator action gate inside the approved route, such as a user answer, user approval, or operator-executed proof step that bounded automation still cannot perform in the current environment
- `global_blocked`: run-session stop reason reserved for environment or execution-context blockers that prevent runtime progress and have no approved operator-action fallback inside the current route; it is not the normal outcome for failed proof that needs code repair or for proof that only needs operator execution
- `done`: post-ship terminal module state after explicit mainline integration is complete
- `ready_for_acceptance`: execution is complete and the module is ready to enter the final acceptance workflow inside the top-level `accept` surface owned by `godot-rup-acceptor`; that workflow may include human review if planning truth required it
- `accepted`: final module acceptance passed and current-format exact passing acceptance evidence was reread before promotion; if any acceptance-gating human review was configured for the module, it also passed
- `all_done`: run-session terminal stop reason meaning every requested module has been explicitly shipped into project mainline

## Acceptance evidence terms

- `Current-format exact passing acceptance evidence`: an `Acceptance Summary` in the active evidence-summary shape with `scope_id = module-acceptance`, `kind = acceptance`, `status = pass`, `outcome = done`, and `completion_quality = exact`
- `Acceptance Readback`: the explicit reread of current decision truth, graph truth, acceptance dossier, optional human-review record, and cited authoritative evidence before promoting a module to `accepted`
- `Migration Preservation Claim`: an evidence-bearing claim that behavior, state meaning, serialized content, or upgrade semantics remain preserved across migration or version change unless planning truth explicitly approved an intentional change
- `Pilot Verdict`: a workflow-level judgment over real shipped module outcomes; allowed values are `Keep`, `Fix`, and `Rollback`. It does not replace module status or top-level runtime phase truth.

## Entry terms

- `godot-rup-planner`: top-level planning agent surface
- `godot-rup-runner`: top-level execution agent surface and runner shell
- `godot-rup-acceptor`: top-level acceptance agent surface
- `godot-rup-step`: manual single-slice entry
- `orchestrate-runtime`: scheduler slice that must stay in the `Root Runner Context`; it may not be hosted inside a child agent
- `godot-rup-prepare-packet`: same-context scheduler entry for one packet preparation
- `godot-rup-settle-layer`: same-context scheduler entry for one drained layer settlement
- `godot-rup-integrate-layer`: same-context scheduler entry for one gated module-layer integration
- `godot-rup-task`: subagent-only task producer entry for one task packet
- `godot-rup-craft`: subagent-only craft producer entry for one craft packet
- `godot-rup-proof`: subagent-only proof producer entry for one proof packet
- `godot-rup-review`: subagent-only review producer entry for one review packet
