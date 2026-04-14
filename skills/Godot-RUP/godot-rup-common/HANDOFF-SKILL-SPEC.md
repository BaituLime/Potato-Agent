---
title: Godot-RUP handoff and skill specification
status: active-rebuild
language: C#
---

# Godot-RUP Handoff and Skill Specification

This document defines the active Handoff split and Skill/top-level-surface boundaries for the rebuilt `godot` workflow.

High-frequency execution surfaces should prefer their role-local common docs instead of reopening this aggregate skill map by default.

Authority split:

- this document is authoritative for bundle boundaries, skill responsibilities, and top-level workflow surfaces
- concrete artifact paths and schema locations live in `HANDOFF-CONTRACT.md`
- runtime and acceptance behavior semantics live in `RUN-SESSION-CONTRACT.md`, `EXECUTION-PROGRAM.md`, `EXECUTION-SURFACE-PROTOCOL.md`, `EXECUTION-CONDUCTOR-CONTRACT.md`, `LEAF-WORKER-CONTRACT.md`, `CONTINUATION-AND-RECOVERY-CONTRACT.md`, `EXECUTION-STOP-PERSISTENCE-RULES.md`, `IDLE-REINJECTION-AND-LOOP-GUARD-RULES.md`, `EXECUTION-LEARNINGS-CONTRACT.md`, and `ACCEPTANCE-PROGRAM.md`

## Bundle catalog

- `Context Bundle`: repo facts and tools; writes `context/context.json`
- `Use-Case Design Bundle`: approved operator-facing use-case contract; writes authoritative `use-cases/<module_id>.md`, companion `use-cases/<module_id>.json`, and immutable history under `use-cases-history/<module_id>/`
- `Decision Bundle`: approved route and acceptance plan; writes `decision/<module_id>.json` and optional human-readable `decision/<module_id>.md`
- `Execution Blueprint Bundle`: draft-first then approved implementation-route rehearsal; writes `blueprint/<module_id>.draft.md`, `blueprint/<module_id>.draft.json`, then after approval promotes to `blueprint/<module_id>.md`, `blueprint/<module_id>.json`, and immutable history under `blueprint-history/<module_id>/`
- `Blueprint Draft Review Bundle`: strict non-authoritative review of one blueprint draft; writes one temporary file under `/tmp/godot-rup-blueprint-review/`
- `Graph Bundle`: approved module-local DAG; writes latest alias `graph/<module_id>.json` plus immutable history under `graph-history/<module_id>/`
- `Run Session Bundle`: session, combined DAG, weave, slots, module state
- `Run Packet Bundle`: one run-local packet
- `Raw Attempt Bundle`: one task, craft, proof, or review attempt
- `Settlement Bundle`: one drained layer settlement
- `Integration Bundle`: one module-layer integration record
- `Acceptance Dossier Bundle`: one module dossier
- `Evidence Bundle`: authoritative scope or module evidence

## Inheritance discipline

- global workflow rules belong in `godot-rup-common/*.md`
- the canonical runner/user-facing reply path for execution lives in `godot-rup-common/EXECUTION-SURFACE-PROTOCOL.md`
- individual `SKILL.md` files may add only scope-local goals, preconditions, read/write boundaries, and consistency gates
- planning skills inherit planning artifact semantics from the common docs; they may clarify phase-local behavior but may not redefine active planning truth
- top-level primary agents are thin user-facing surfaces only; they may not redefine artifact meaning, runtime state semantics, or skill authority
- when a global rule changes, update the common docs first, then trim or align skill and top-level surface docs instead of copying the same rule across the tree
- before reusing existing handoff artifacts, all skills must treat the active common docs plus current schemas as the first authority
- when an existing handoff artifact conflicts with current `godot-rup-common/*.md` rules or active schemas, the common docs and schemas win; do not imitate stale handoff shape just because it is nearby

## Top-level primary surfaces

| Surface | Purpose | Delegates to |
| --- | --- | --- |
| `godot-rup-planner` | Guided multi-turn planning and visible replanning surface | planning skills only |
| `godot-rup-runner` | Root unattended execution surface | `compose-runtime-dag`, `allocate-worktrees`, `orchestrate-runtime`, `cleanup-run-worktrees`, and `repair-delta-plan` when approved repair policy allows same-route delegated delta planning |
| `godot-rup-acceptor` | Workflow-shaped final acceptance surface, with optional human review and optional explicit shipping | `assemble-acceptance-dossier`, `prepare-user-review-brief`, `record-user-review-gate`, `accept-module`, `integrate-main`, `cleanup-worktrees` |
| `godot-rup-step` | Manual single-slice operator surface | exactly one requested runtime or acceptance skill |

## Active skill catalog

| Skill | Purpose | Writes |
| --- | --- | --- |
| `context-discovery` | Discover project facts and tools | `context/context.json` |
| `use-case-design` | Record approved operator-facing use-case contract | `use-cases/<module_id>.md`, `use-cases/<module_id>.json`, `use-cases-history/<module_id>/<use_case_design_revision_id>.md`, `use-cases-history/<module_id>/<use_case_design_revision_id>.json` |
| `architecture-review` | Record approved technical route | `decision/<module_id>.json`, `.md` |
| `execution-blueprint` | Record draft-first then approved implementation-route rehearsal | `blueprint/<module_id>.draft.md`, `blueprint/<module_id>.draft.json`, then `blueprint/<module_id>.md`, `blueprint/<module_id>.json`, `blueprint-history/<module_id>/<blueprint_revision_id>.md`, `blueprint-history/<module_id>/<blueprint_revision_id>.json` |
| `blueprint-draft-review` | Strictly review one blueprint draft and emit one temporary review file | `/tmp/godot-rup-blueprint-review/<module_id>.md` |
| `workflow-design` | Record workflow shape and acceptance plan | `decision/<module_id>.json`, `.md` |
| `dag-plan` | Record approved module-local DAG | `graph/<module_id>.json`, `graph-history/<module_id>/<graph_revision_id>.json`, decision graph-gate notes |
| `repair-delta-plan` | Record lawful same-route delegated repair planning | `graph/<module_id>.json`, `graph-history/<module_id>/<graph_revision_id>.json`, and when needed `blueprint/<module_id>.md`, `blueprint/<module_id>.json`, `blueprint-history/<module_id>/<blueprint_revision_id>.*` |
| `spike` | Record optional planning-stage validation for one approved uncertainty | `spikes/<module_id>/<spike_id>.json` |
| `compose-runtime-dag` | Build combined DAG and dispatch weave | `runs/<run_id>/session.json`, `combined-dag.json`, `dispatch-weave.json`, `slot-demand.json`, `todo.json` |
| `allocate-worktrees` | Create integration and worker slots | repo-local worktrees, `slot-table.json`, `modules/<module_id>.json`, `session.json` |
| `orchestrate-runtime` | Schedule run scopes and internal next actions | `session.json`, `modules/<module_id>.json` |
| `cleanup-run-worktrees` | Tear down run-scoped worker worktrees when a stopped run is being cleaned now | repo-local run worker worktrees, `runs/<run_id>/slot-table.json`, `runs/<run_id>/session.json` |
| `prepare-packet` | Compile one run-local packet | `runs/<run_id>/packets/<module_id>/<scope_id>.json` |
| `run-task` | Produce one implementation attempt | project files inside assigned checkout, one raw attempt |
| `run-craft` | Produce one interactive implementation convergence attempt | project files inside assigned checkout, one raw attempt |
| `run-proof` | Produce one compile, headless, MCP, or harness attempt | project files when required, one raw attempt |
| `run-review` | Produce one selected review attempt | one raw attempt |
| `settle-layer` | Attest then gate one drained layer | authoritative scope evidence, one settlement, `session.json`, `modules/<module_id>.json` |
| `integrate-layer` | Integrate one module-layer | integration git state, one integration record, `slot-table.json`, `session.json`, `modules/<module_id>.json` |
| `assemble-acceptance-dossier` | Collect one module dossier | `runs/<run_id>/acceptance/<module_id>/dossier.json` |
| `prepare-user-review-brief` | Compile one human-review guide | `runs/<run_id>/acceptance/<module_id>/human-review-brief.json` |
| `record-user-review-gate` | Record one explicit human-review result | `runs/<run_id>/acceptance/<module_id>/human-review-record.json` |
| `accept-module` | Judge final module acceptance and write acceptance-kind evidence | `evidence/<module_id>/module-acceptance/summary.json` |
| `integrate-main` | Promote one accepted module into project mainline and update run-session ship state | project mainline git state, `runs/<run_id>/session.json`, `runs/<run_id>/modules/<module_id>.json` |
| `cleanup-worktrees` | Remove no-longer-needed worktrees after successful ship and record cleanup state | repo-local worktree topology, `runs/<run_id>/slot-table.json`, `runs/<run_id>/session.json`, `runs/<run_id>/modules/<module_id>.json` |

## Internal same-context scheduler command entrypoints

- `godot-rup-prepare-packet` loads `prepare-packet` for exactly one ready scope and stays in the current scheduler context
- `godot-rup-settle-layer` loads `settle-layer` for exactly one drained `module_id + layer_id` target and stays in the current scheduler context
- `godot-rup-integrate-layer` loads `integrate-layer` for exactly one integration-gated `module_id + layer_id` target and stays in the current scheduler context
- these command entrypoints do not imply child dispatch and may not be used to escape the scheduler's one-context rule

## Internal producer command entrypoints

- `godot-rup-task` is the canonical producer command label and direct/manual instruction mirror for exactly one task packet
- `godot-rup-craft` is the canonical producer command label and direct/manual instruction mirror for exactly one craft packet
- `godot-rup-proof` is the canonical producer command label and direct/manual instruction mirror for exactly one proof packet
- `godot-rup-review` is the canonical producer command label and direct/manual instruction mirror for exactly one review packet
- unattended native-child dispatch does not rely on OpenCode auto-executing the child `command` field; the scheduler must place producer instructions and packet path directly into the child prompt
- the optional child `command` field may mirror the matching producer command label for audit only
- these producer surfaces may not spawn another nested producer child
- spike result: once one of these command entrypoints is running in its child context, OpenCode does not expose another built-in subtask-dispatch layer there
- concrete native-child payload is: short `description`, authoritative producer `prompt`, resolved child-agent id in OpenCode `subagent_type`, and optional audit-only `command`
- packet path alone is not a sufficient producer dispatch contract because producer semantics and resolved routing must be fixed before the child starts
- active producer dispatch audit records only `opencode_native_child`; unattended execution may not reintroduce `direct_thread`

## Internal planning review command entrypoints

- `godot-rup-review-blueprint-draft` is the canonical strict-review command label and direct/manual instruction mirror for exactly one blueprint draft
- this command should run in a fresh child review context rather than inside the ongoing blueprint-writing context
- it may write only one temporary review file under `/tmp/godot-rup-blueprint-review/`

## Hard write boundaries

- planning skills may write only planning artifacts
- `godot-rup-runner` may not edit project files or write authoritative evidence; its only direct authoritative runtime artifact write outside delegated skills is `runs/<run_id>/scheduler-return.json`
- `compose-runtime-dag` may not create worktrees or dispatch child scopes
- `allocate-worktrees` is the only worktree allocator
- `orchestrate-runtime` may not edit project files, call MCP directly, or write authoritative evidence
- `repair-delta-plan` may write only lawful same-route planning artifacts; it may not write runtime state directly
- `prepare-packet` may write only one run-local packet
- `run-task`, `run-craft`, `run-proof`, and `run-review` may write only one raw attempt plus allowed checkout-local changes
- `settle-layer` is the first authority that may convert raw attempts into authoritative pass or rework state
- `integrate-layer` may integrate one module-layer only
- `cleanup-run-worktrees` may remove only run-scoped worker worktrees for one runner-selected stopped run and update run cleanup state
- `execution-blueprint` may write only one approved blueprint alias pair plus any required archived prior revision pair
- `use-case-design` may write only one approved use-case-design alias pair plus any required archived prior revision pair
- `assemble-acceptance-dossier` may not judge pass or fail
- `prepare-user-review-brief` may write only one human-review brief, and only when planning truth requires at least one human-review track
- `record-user-review-gate` may write only one human-review record, and only when planning truth requires at least one human-review track
- `accept-module` may write only the final module acceptance summary
- `cleanup-worktrees` may remove only shipped-module worktrees and update runtime cleanup state; it may not claim shipping, acceptance, or planning changes
- no runtime skill may use ad hoc scripts to fabricate handoff state outside its declared write boundary
- bounded temporary proof helpers are allowed inside producer write boundaries when they execute the approved proof itself rather than fabricate workflow truth

## Planning-specific rules

- `godot-rup-planner` is the top-level planning surface only and may not pretend to be the unattended execution shell
- `context-discovery` owns repo facts, tool discovery, proof-boundary facts, and unresolved factual blockers
- `use-case-design` owns the approved key use cases, operator-facing success semantics, and acceptance-sensitive behavior claims before technical route approval begins
- `architecture-review` owns the approved technical route and route-level constraints against the already-approved use-case-design truth
- `execution-blueprint` owns the approved implementation route, coverage against approved use-case design, shared route decisions, and derived parallelization/convergence after both use-case-design and architecture route are approved
- `execution-blueprint` may not surface `DG-BLUEPRINT-*` until the proposed blueprint survives the internal self-check in `godot-rup-common/BLUEPRINT-REVIEW-RUBRIC.md`
- `execution-blueprint` should also perform an explicit blueprint gap analysis and choose one review-gate verdict before any `DG-BLUEPRINT-*` recommendation appears
- `execution-blueprint` should reject decorative support branches, decomposed composite orders, and token-frugal summarization, and should use whatever repo context and response length are needed to make the route clear
- `execution-blueprint` should write the authoritative blueprint artifacts in English, but should summarize recommendations to the user in concise Chinese unless the user explicitly asks for another language
- `execution-blueprint` route steps should make the first implementer move and first route cut explicit enough that weaker downstream execution does not have to rediscover the route
- `execution-blueprint` should derive the Chinese discussion summary from the current English `blueprint/<module_id>.draft.*` pair rather than using the discussion-summary shape as the blueprint-thinking scaffold
- `execution-blueprint` should materialize that draft as `blueprint/<module_id>.draft.*` before any gate verdict, and should not leave `*.draft.*` beside approved aliases after promotion
- `execution-blueprint` should run one fresh `godot-rup-review-blueprint-draft` pass against the current draft before any gate verdict, and should use that strict review as a real constraint rather than a ceremonial happy test
- `workflow-design` maps approved use-case semantics plus the approved route and approved execution blueprint to workflow steps, decision gates, and structured required evidence
- `workflow-design` also decides whether `repair_policy` stays manual-only or allows lawful same-route delegated delta planning
- `dag-plan` compiles the approved execution blueprint and workflow truth into the strict MVP task DAG, dependency truth, safe-parallelism shape, and active per-task dispatch settings
- when `repair_policy` is present in approved decision truth, `dag-plan` must carry it forward into the approved graph without silently changing its guards
- `repair-delta-plan` is the only planning skill that may supersede graph truth inside the unattended execution route, and only while same-route preservation still holds
- `repair-delta-plan` may write `blueprint_plus_graph_delta` only when execution exposed insufficient same-route blueprint truth and the repaired graph is repinned honestly to that newer blueprint revision
- current-format graph writes are invalid unless they preserve blueprint linkage through top-level `source_blueprint_revision_id` and per-task `source_realization_ids[]`
- active per-task dispatch planning is only the joint pair `model_tier + reasoningEffort`; choose that pair together, do not let task `kind` or any other semantic metadata replace `reasoningEffort`, and do not reintroduce retired keys such as `reasoning_effort`, `verbosity`, or planning-level `subagent_type`
- planning must explicitly mark each required evidence and acceptance input as `proof_rigor = smoke` or `strict`; optimism may not hide in implicit defaults
- `smoke` is a sanity-only classification, not a quiet default behavior-proof mode
- operator-visible behavior proof should normally be `strict`; if a plan marks it `smoke`, that downgrade must already be justified by approved decision truth
- planning should shape tasks so `mini` is sufficient for as many scopes as safely possible, but must switch to `full` when material ambiguity, cross-boundary behavior work, or expensive recovery risk appears
- `dag-plan` should prefer an honest MVP cut plus narrower tasks before reaching for broader dispatch pairs; `mini + high` is the normal default for narrow implementation work, while `full` remains available when the task is still genuinely broad after that cut
- `dag-plan` should not fear many tasks when safe parallelism is real; one-primary-thing tasks are preferred, and it should actively consider `mini + xhigh` for narrow knotty work and `full + medium` for broader routine work instead of collapsing everything into the extremes
- `dag-plan` must cut by execution context as well as feature intent: no task may require mandatory work outside its ownership boundary, and planning-artifact `must_read` paths should be handoff-root absolute rather than checkout-relative
- `dag-plan` should use `craft` for Godot UI, scene, animation, and interaction realizations that need editor or MCP-backed feedback during implementation rather than only at late proof time
- `craft` scopes may be more clustered than blind implementation tasks when one coherent surface would otherwise thrash through repeated task/proof rework loops or repeated MCP startup cost
- planning should maximize safe parallelism; only real predecessor dependencies, mutual exclusion, or shared mutable ownership conflicts justify serializing tasks
- `spike` is optional planning-stage temporary validation only and may not be treated as final module acceptance evidence by itself

## Runtime-specific rules

- active runtime state is run-session scoped, not `run/_global.json`
- scheduling authority belongs only to `orchestrate-runtime`
- stop-policy authority belongs to `orchestrate-runtime`, while runner-owned reverse-gate receipts belong to `godot-rup-runner`
- the top-level user-facing execution surface is the `godot-rup-runner` agent, not a command-led entry surface
- `compose-runtime-dag`, `allocate-worktrees`, and `orchestrate-runtime` are sequential runner-local phases in one session context
- after smooth execution completion stops such as `ready_for_acceptance`, `cleanup-run-worktrees` must run in that same runner-owned context before the stop is surfaced as a completed iteration
- after blocked or stalled stops such as `manual_needed`, `replan_needed`, or `global_blocked`, cleanup is deferred by default; the next runner iteration decides whether the stopped run should be kept for inspection/resume or retired through `cleanup-run-worktrees`
- in unattended execution, that scheduler context must be the `Root Runner Context`; `orchestrate-runtime` may not be hosted inside a child agent
- `prepare-packet`, `settle-layer`, and `integrate-layer` are sequential scheduler-local phases in one session context
- if command wrappers are used for those phases, they remain same-context scheduler operations rather than child dispatch
- producer scopes may self-claim only `ready_for_attest`, `partial`, or `blocked`
- unattended execution may not use `direct_thread`
- editor bootstrap and teardown belong to the MCP-consuming craft, proof, or review scope
- ordinary `run-task` scopes should not rely on MCP/editor lifecycle as a primary execution dependency; if they do, planning likely should have classified them as `craft`
- integration is always per module even when scheduling is combined across modules
- weave may shift only whole module layers; partial layer admission is invalid
- weave optimization objective is minimize `peak worker-slot demand * combined topo DAG height`
- if an epoch is admitted, all of its admitted writer scopes must be dispatched
- proof and review scopes are fail-fast by default: dispatch the minimum ready set, normally one scope at a time per admitted layer, rather than fanning out a whole proof/review layer speculatively
- after any proof or review raw attempt in a layer returns `partial` or `blocked`, do not launch untouched later sibling proof/review scopes in that same layer; wait only for already-in-flight siblings, then settle the layer immediately
- producer child dispatch should use the matching producer prompt template for `godot-rup-task`, `godot-rup-craft`, `godot-rup-proof`, or `godot-rup-review`, not a deleted top-level command surface
- producer `task` / `craft` / `proof` / `review` scopes are first-level children from the root runner-owned scheduler context only; they may not become second-level children under a child-hosted scheduler
- the scheduler must treat producer children as leaf workers, not as mini-schedulers
- the scheduler must create producer children with the packet's resolved dispatch fields and authoritative producer prompt instead of falling back to a default child route
- `dag-plan` owns the joint dispatch pair `model_tier + reasoningEffort`; runtime may not replace that pair with a different planning decision, but packet preparation may apply the explicit active resolver normalization table when selecting a concrete child profile
- packet preparation owns resolving that joint dispatch pair into `resolved_subagent_type`, `resolved_model`, `resolved_reasoningEffort`, and `producer_command` before producer dispatch begins
- packet preparation also pins `graph_revision_id` so later attempts and proofs stay tied to the exact approved DAG revision that produced them
- for current-format graph truth, packet preparation must also preserve `source_blueprint_revision_id`, `source_realization_ids[]`, and a narrow but detail-rich `blueprint_excerpt` with an exact blueprint markdown anchor
- packet preparation must preserve approved `proof_rigor` on every carried acceptance input; runtime may not quietly downgrade strict proof obligations into smoke
- if the resolved child agent is unavailable in the current OpenCode installation, runtime must fail closed instead of silently falling back to another agent
- layer-local `rework_needed` means more execution is required, not that runtime hit an environment blocker
- if a settled `rework_needed` layer has no already-approved repair continuation in the current graph, the scheduler must stop with `replan_needed` rather than inventing new graph truth
- crossing that `replan_needed` boundary is a planning transition unless lawful same-route delegated delta planning is still available under the approved `repair_policy`
- when same-route delegated delta planning is allowed, only `godot-rup-runner` may invoke `repair-delta-plan`, and only while use-case truth, route truth, acceptance bar, and `proof_rigor` still remain unchanged
- after that real `replan_needed` stop, the runner owns only the admission gate for invoking `repair-delta-plan`; the skill itself owns result classification and planning writes
- that runner admission gate must enforce the carried `repair_policy` result-class guards and the carried lineage delta-count bound before any skill invocation
- runtime itself may not author `graph_delta_only` or `blueprint_plus_graph_delta`; it must stop and hand control back to the runner shell for that delegated planning step
- counted delta attempts must remain bounded across the uninterrupted unattended route lineage; lawful fresh runs after delta do not reset that count
- if delegated same-route delta planning starts looping rather than converging, or if the carried lineage bound is exhausted, the runner must stop with `replan_needed`
- a new iteration may not quietly inherit worker worktrees from a previous stopped run as if they were its own active runtime capacity; the runner must either intentionally resume that stopped run or retire it through `cleanup-run-worktrees`
- if a recovered scheduler slice loses native producer-dispatch capability while runnable work still exists, the runner must refresh the scheduler context automatically instead of surfacing a fake approval stop to the user
- `dispatch_refresh_needed` assumes the runner can reopen the scheduler from root; if the scheduler was launched in a child agent that lacks first-level dispatch authority, that host-layer mistake is an execution-context blocker, not a refresh loop
- if the approved proof boundary still stands but the current environment still requires explicit operator proof execution after bounded automation attempts, the scheduler should stop with `manual_needed` rather than `global_blocked`
- passive waiting without in-flight producer children is forbidden
- returning while session truth still says `current_phase = orchestrating` and `yield_reason = null` is invalid
- the runner must write `scheduler-return.json` after every returned scheduler slice and then follow the `Execution Surface Protocol`; only the receipt-authorized `surface_stop_to_user` path may reach the user
- unattended execution requires an execution context that can write to the target repo and its repo-local worktrees
- `manual_needed` is invalid when used only to cover the scheduler's failure to attempt producer dispatch in a valid execution context
- layer-local quick checks are not where MCP should normally appear; MCP should be expressed as explicit craft, proof, or review scope work
- if a proposed implementation scope genuinely needs editor-mediated authoring as its main action, do not smuggle that need in as an ordinary `run-task`; surface it as a planning decision or future dedicated producer shape
- smoke checks may exist as auxiliary sanity only, but runtime and acceptance may not treat them as satisfying a strict proof obligation

## Active resolved execution profiles

- `full + medium -> godot-rup-exec-full-medium`
- `full + high -> godot-rup-exec-full-high`
- `full + xhigh -> godot-rup-exec-full-xhigh`
- `mini + high -> godot-rup-exec-mini-high`
- `mini + xhigh -> godot-rup-exec-mini-xhigh`
- explicit active normalization: `mini + medium -> godot-rup-exec-mini-high`

## Dispatch-setting guide

- `mini` is for narrow implementation/proof work with obvious verification and low rework blast radius
- planning should shape tasks so `mini` is sufficient for as many scopes as safely possible without hiding real risk
- `full` is for planning, review, synthesis, acceptance-sensitive judgment, cross-boundary behavior work, ambiguous recovery, or any scope likely to need broad context expansion
- `medium` is for straightforward read-heavy or low-ambiguity scopes where the current active profile table still keeps the route cheap
- `high` is the default for most implementation and proof scopes
- `xhigh` is for review, acceptance-sensitive judgment, cross-boundary behavior work, or scopes where a bad recovery loop would be expensive
- if there is material doubt, use `full` and at least `high`

## Acceptance-specific rules

- execution stops at `ready_for_acceptance`
- `workflow-design` decides the module's `acceptance_plan.human_review_plan` directly instead of making acceptance infer review requirements from workflow steps or decision-gate names
- `godot-rup-acceptor` must reread that planning truth and branch accordingly instead of assuming human review is always required
- when at least one human-review track is required, `prepare-user-review-brief` must convert dossier truth into a concise guided-review brief before collecting review results
- when at least one human-review track is required, `record-user-review-gate` must persist the explicit human-review result instead of relying on transient chat alone
- only a recorded `pass` for every acceptance-gating review track may unlock `accept-module`
- only `godot-rup-acceptor` may promote a module to `accepted`, and only after rereading current-format exact passing acceptance evidence plus the required human-review results when those gates were active
- `accept-module` owns any disposable acceptance checkout locally when final proof still requires one; acceptance checkouts are not shared slot-table resources
- exact passing acceptance evidence must be concrete written acceptance-kind evidence, not chat prose or stale module status alone
- exact passing acceptance evidence must also match the approved `proof_rigor`; smoke evidence may not satisfy a strict acceptance entry
- human review, when activated by planning truth, is a real recorded workflow step rather than a post-accept afterthought

## Ship-specific rules

- shipping is an explicit later gate inside `godot-rup-acceptor`, not a separate user command
- only explicit user approval may authorize shipping
- only `integrate-main` may move a module from `accepted` to `done`
- only `integrate-main` may record the resulting `last_mainline_commit`
- post-ship worktree removal belongs to `cleanup-worktrees`, not `integrate-main`
- `godot-rup-acceptor` should run `cleanup-worktrees` after each successful shipped module so stale integration worktrees do not linger
- `session.stop_reason = all_done` is valid only when every requested module in the run is `done`

## Pilot-specific rules

- pilot judgment is workflow-level meta evaluation, not a new runtime phase
- pilot verdicts should prefer modules that already reached `done` with current-format exact passing acceptance evidence
- `Keep`, `Fix`, and `Rollback` may not rewrite module status by prose alone
- `Rollback` requires explicit corrective action rather than a chat-only label

## Execution cleanup rules

- execution-stage worker cleanup is separate from ship cleanup
- only `cleanup-run-worktrees` may claim run-level worker-worktree teardown in runtime state
- `godot-rup-runner` must call `cleanup-run-worktrees` immediately for smooth completion stops such as `ready_for_acceptance`; for `manual_needed`, `replan_needed`, or `global_blocked`, it should defer cleanup until a later runner iteration decides the stopped run is being retired rather than kept for inspection or direct resume
- `dispatch_refresh_needed` is an internal runner yield, not an iteration end, so it may not trigger run-worktree teardown
- if a stopped run is later resumed, `allocate-worktrees` may reprovision cleaned worker slots at the same canonical paths

## Deprecated execution surface

Deprecated execution skills may exist in an OpenCode deprecated skill bundle.

They are reference only and may not be treated as active authority.
