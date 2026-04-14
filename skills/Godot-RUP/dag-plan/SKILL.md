---
name: dag-plan
description: Build the Atomic Task DAG, Red/Black Topo Layers, and per-task dispatch settings for one module
compatibility: opencode
---

# DAG Plan (Godot-RUP + C#)

Use this Skill to build the execution graph for one Module after use-case design, architecture, execution-blueprint, and workflow decisions are approved.

Canonical references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/TERMS.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-SKILL-SPEC.md`

## Goal

Create a recommended `Atomic Task DAG` plus module acceptance support summary, then write the approved graph into the `Graph Handoff` and sync the approved graph gate in the `Decision Handoff` after the user passes the required `Decision Gate`.

Reread the canonical common workflow docs and active schemas before reusing any older graph or handoff pattern. Existing handoff artifacts may provide route context, but they may not override active graph shape or scheduling rules.

## Read boundary

Read from:

- `Context Handoff`
- approved `Use-Case Design`
- `Decision Handoff`
- approved `Execution Blueprint`
- module-specific architecture references and approved constraints
- relevant authoritative settlements or evidence when doing bounded delta repair planning after a prior execution failure

## Write boundary

You may write only:

- `Graph Handoff`
- `graph-history/<module_id>/`
- `Decision Handoff` graph-gate status and notes

Only write them after the user approves the proposed graph.

Exception: when approved planning truth explicitly enables lawful same-route delegated delta planning, `repair-delta-plan` may write one lawful superseding `graph_delta_only` or `blueprint_plus_graph_delta` result without a fresh user-visible graph gate, but only if the approved route, acceptance bar, and `proof_rigor` all remain unchanged.

- If this plan supersedes an earlier approved graph, archive the prior revision under `graph-history/<module_id>/<graph_revision_id>.json` before replacing `graph/<module_id>.json`.
- Do not silently discard an earlier approved graph revision.

## Graph planning rules

- Plan one Module at a time.
- Use semantic string IDs.
- Compile the approved execution blueprint; do not reinvent the MVP structure from scratch.
- Treat the authoritative blueprint markdown as source truth, and use the companion index only for stable ids and linkage. Every newly written task must map back to one or more `source_realization_ids[]`.
- Use DAG planning to decompose the approved rehearsals and derived convergence routes into executable tasks, but do not erase or contradict the blueprint's route details, rejected tempting routes, failure handling, or convergence logic.
- If a supposed realization id looks like disguised shared-route detail, decorative structure, or an under-rehearsed bucket, stop and return upstream to `execution-blueprint` instead of normalizing it into tasks.
- This phase owns the actual MVP cut. Prefer the smallest honest deliverable that proves the module is really moving in the approved direction.
- First cut to MVP, then push safe parallelism as far as the real dependencies allow.
- Unless tasks are truly mutually exclusive, dependency-coupled, or share the same mutable ownership boundary in a way that forbids concurrency, keep them parallel.
- Derive dependencies from real predecessor logic.
- Form `Red Topo Layers` from dependency readiness.
- After the user approves the MVP DAG shape, run an acceptance-backchain pass over the approved use-case rehearsals, derived realization ids, and workflow acceptance plan by asking which evidence each realization must ultimately support.
- Use that pass to generate or augment explicit DAG proof tasks before writing the final approved graph.
- Select review targets only after Red-layer planning is stable.
- Derive `Black Topo Layers` from those selected review targets.
- Do not create a final module-acceptance verdict node as an `Atomic Task`.
- Acceptance-support proof tasks may still appear inside the DAG when they produce real proof inputs.
- Bind the approved acceptance plan to concrete supporting task IDs, evidence inputs, required checks, and required resources in `module_acceptance`.
- If approved decision truth includes `repair_policy`, carry it into the written graph without widening its guards.
- Use `kind = craft` for bounded Godot implementation scopes where editor/runtime feedback is part of getting the surface into a sane state, not just something to verify later.
- Do not force UI or interaction work through a blind `task -> proof -> rework` loop when basic convergence clearly belongs earlier in execution.
- In lawful same-route delegated delta planning, keep repair planning bounded to the same approved route: no new architecture, no acceptance-bar change, no `proof_rigor` downgrade, and no broad workflow rewrite.
- In lawful same-route delegated delta planning, keep the delta inside one failing module and one existing realization neighborhood; do not spread the repair across unrelated realizations or modules.
- Same-route delegated delta planning may add, split, resequence, or rerun scopes only to repair the failing implementation path and re-establish the already-approved proof path. It may not smuggle in new acceptance claims.
- Same-route delegated delta planning may add stricter local checks or support scopes when they help satisfy the same acceptance contract, but it may not relax existing checks, remove required proof, or silently narrow the claim.
- If the superseding graph starts to look like a fresh redesign instead of a local repair continuation, stop and require visible replanning.
- If the failure evidence shows the route itself is suspect or the repair would need broader workflow truth changes, stop and require visible replanning instead of pretending this still fits same-route delta law.
- If the proposed DAG needs to merge, split, or resequence realizations in a way that contradicts the approved blueprint rehearsal rather than merely compiling it, stop and return upstream to `execution-blueprint` instead of silently mutating execution shape here.

## Structured output rules

The written graph must include:

- top-level `source_blueprint_revision_id`
- `module_acceptance.required_evidence[]` as structured checklist entries
- `tasks[].source_realization_ids[]`
- `tasks[].acceptance_inputs[]` as structured typed inputs
- per-task `checks_required`
- per-task `resources_required`
- per-task `model_tier`
- per-task `reasoningEffort`

Every `tasks[].acceptance_inputs[]` entry must include:

- `input_id`
- `description`
- `required_proof_type`
- `proof_rigor`
- `exactness_required`

Do not leave task acceptance as prose-only reminders.

## Dispatch planning rules

- Choose one joint dispatch pair per task: `model_tier + reasoningEffort`.
- Start from each source realization's preplayed route complexity, alternate/failure-flow pressure, invariants, and tripwires.
- Prefer to keep tasks narrow enough that `mini` is still a good fit. Move upward only when the task's real scope, ambiguity, or recovery risk remains broad after an honest MVP cut.
- Actively consider the middle routes instead of collapsing choices into only `mini + high` or `full + xhigh`. In particular, `mini + xhigh` is often right for narrow-but-knotty reasoning work, and `full + medium` is often right for broad-but-routine work.
- Do not pick `model_tier` first and `reasoningEffort` second as if they were unrelated knobs; judge the pair together as one context/risk/cost decision.
- `kind` is semantic task-role metadata, not a dispatch parameter. Do not let `kind` displace or replace `reasoningEffort`.
- A graph that has `kind + model_tier` but omits `reasoningEffort` is incomplete and not execution-ready.
- Allowed `model_tier` values are `full` and `mini`.
- Allowed `reasoningEffort` values are `medium`, `high`, and `xhigh`.
- Use `mini + medium` for narrow, read-heavy, low-ambiguity inspection or evidence-location work where verification is obvious and rework blast radius is tiny.
- Use `mini + high` for narrow implementation or proof work that stays tightly bounded and cheap to verify.
- Use `mini + xhigh` as the normal default when scope stays narrow but the reasoning knot is difficult.
- Use `full + medium` as the normal default for broader-context but still routine synthesis or inspection where the route is already clear.
- Use `full + high` as the normal default for `craft` scopes unless the surface is unusually simple or unusually gnarly.
- Use `full + high` when the task truly remains cross-authority or broad-context after you have already tried to cut it to an honest MVP slice.
- Use `full + xhigh` only when the task still carries materially ambiguous, high-stakes cross-boundary judgment even after that narrowing work.
- Do not choose `craft` just because a scope is hard. Choose it when live Godot editor/runtime feedback is genuinely part of implementing the scope rather than only proving it.
- The current runtime profile inventory has no dedicated `mini + medium` child agent; if you choose `mini + medium`, packet preparation will explicitly normalize it to `godot-rup-exec-mini-high` and record that normalization for audit.
- Before moving upward, first ask whether the task itself is still too broad and should be cut smaller.

## MVP task-splitting rules

- Split tasks by strict MVP slices.
- Do not fear a larger task count. This workflow executes in parallel by design, so when scopes can be verified independently and safely admitted together, cut them.
- A good task should do one primary thing. If a task description naturally reads as "do A, B, and C", that is usually a sign the task still needs to be cut.
- Let the detailed blueprint realizations drive task shape. Do not use DAG planning to smuggle deferred work back into an MVP slice just because the files are nearby.
- Each task should be the smallest independently verifiable slice that still produces meaningful progress.
- Prefer multiple narrow tasks over one broad task when they can be verified independently without losing the real route.
- When choosing between slight over-splitting and under-splitting, prefer the extra cut if it preserves the route and keeps tasks mini-friendly.
- Prefer splits that maximize safe parallelism and keep read/write surfaces narrow.
- Do not serialize tasks merely because they touch nearby files; serialize only when there is a real dependency or mutual exclusion.
- When a Godot UI or interaction surface needs repeated editor/runtime feedback just to reach baseline sanity, prefer one clustered `craft` scope over several blind micro-tasks followed by late proof churn.
- Cluster `craft` by one coherent surface, scene lane, or tightly coupled interaction slice. Do not let it sprawl into a whole-module grab bag.
- If planning truth or discovery says a runtime resource such as `gopeak-mcp` is singleton, no module layer may contain more than one scope that requires that same singleton resource.
- Do not split one MCP-backed interactive craft, proof, or review flow across several sibling scopes that all depend on the same live editor session. Prefer one self-contained scope that owns bootstrap, interaction, observation, and teardown.

## Context-splitting rules

- Cut by execution context, not just by feature label.
- A task must be actually completable inside its `ownership_boundary` plus its packet-listed planning context.
- If an acceptance input requires changing, migrating, deleting, or proving truth in a file outside the proposed `ownership_boundary`, do not hide that obligation in prose. Either widen the boundary deliberately or split a new task.
- Do not let `likely_read` carry mandatory implementation work. If a file is essential to completing the task's stated acceptance input, either it belongs in the ownership boundary or the task boundary is wrong.
- Do not combine "establish new authority" and "remove old authority from another seam" into one task when those touch materially different surfaces that can be verified independently.
- Do not combine host topology work, authority-spine work, binding-seam work, and object-ui coupling work into one task just because the same realization mentioned them all.
- If one realization contains several independently verifiable context cuts, split them and keep the shared `source_realization_ids[]` linkage.
- For `craft` scopes, it is acceptable to keep several near-neighbor edits together when they belong to one ownership-coherent surface and would otherwise thrash through repeated MCP startup and proof-first feedback loops.

## Planning path rules

- Planning artifacts in `must_read` must be resolvable from the handoff root, not from the worker checkout.
- For planning truth such as `decision/...` and `blueprint/...`, write handoff-root absolute paths in graph truth so packet preparation can pass them through without ambiguity.
- Reserve repo-relative paths in `must_read`, `likely_read`, and `ownership_boundary` for project files expected to exist inside the assigned checkout.
- Do not produce a graph that mixes checkout-relative planning paths with a packet rule that limits the worker to packet-listed files.

## Proof planning rules

- Prefer `proof` tasks when the purpose is to generate evidence, not to judge it.
- Module-wide automated tests, strict headless runs, broad proof harnesses, and final pre-acceptance integrated automated checks should usually be `proof` tasks.
- Do not leave total automated proof generation as a later runtime improvisation.
- Do not leave proof rigor implicit; every acceptance-support input must explicitly say `smoke` or `strict`.
- `smoke` tasks are optional sanity probes only. They may help catch obvious breakage early, but they do not satisfy a strict proof claim by default.
- If you include a smoke check, keep it separate from the strict proof path instead of letting one optimistic run masquerade as the real proof.
- For operator-visible behavior, default to `strict` proof planning unless an upstream decision explicitly narrowed the claim to smoke-level viability.
- Strict behavior proof should usually require fixtures, harnesses, scripted interaction flows, or other support that can exercise adversarial interaction flow, repeated/conflicting sequences, and state churn rather than only a happy path.
- When a Godot surface needs editor/runtime iteration merely to become sane, move that convergence into an earlier `craft` scope and leave `proof` to strict validation instead of first-look debugging.
- Select review targets aggressively wherever smoke substitution or fake confidence would be cheap.
- When planning includes `data_migration_proof` or migration-shaped `snapshot_round_trip`, generate real proof tasks and fixture inputs that exercise preserved-versus-intentionally-changed semantics instead of leaving migration judgment to acceptance prose.
- Do not let compile success, scene-structure checks, or code inspection masquerade as migration proof.

## Dispatch-pair consistency gate

- After writing the graph, inspect every task and confirm the dispatch pair is explicit.
- Confirm the graph records `source_blueprint_revision_id` and every newly written task records `source_realization_ids[]`.
- If `source_blueprint_revision_id` or any task's `source_realization_ids[]` is missing, treat the graph as invalid instead of silently accepting a blueprint-free DAG.
- If any task still has only `kind + model_tier`, or if `reasoningEffort` is missing anywhere, treat the graph as invalid and repair it before returning.
- Do not present `kind` as if it were one half of the dispatch choice.
- Confirm every `required_evidence[]` and `acceptance_inputs[]` entry explicitly declares `proof_rigor`.
- If a behavior-proof claim that carries real user-visible semantics is still marked `smoke` without an explicit upstream approval for that downgrade, treat the graph as invalid and repair it before returning.

## Review selection rules

- Review fewer targets, but choose them more aggressively where risk is real.
- Prefer review targets for:
  - cross-boundary edits
  - high blast-radius behavior changes
  - places where cheap proof is likely to produce false confidence
  - points where contract drift would be expensive
- Do not use review as ceremonial full coverage.

## Runtime boundary

- You may provide parallelism hints.
- You may not set the final runtime `worktree slot` count.
- Runtime slot allocation belongs to orchestration.

## Consistency gate

After writing `graph/<module_id>.json`, inspect it directly and confirm it still matches the approved route, acceptance plan, MVP split, and parallelism shape before treating it as approved execution truth.

- When this is a delta plan, confirm the superseded graph revision remains available under `graph-history/<module_id>/`.

## Output

1. In chat, present the proposed graph in compact reviewable form.
2. In that summary, call out any task that still needs `full` and explain briefly why a narrower MVP cut would distort the route.
3. Call out acceptance-support proof tasks separately from the final module-acceptance step.
4. After the user approves the MVP DAG shape, run the per-realization acceptance-backchain pass and generate or augment the needed proof tasks before final graph write.
5. After approval, write the approved graph into the `Graph Handoff`.
6. Sync the module's `DG-GRAPH-*` entry in the `Decision Handoff`.
7. Check the written graph JSON for consistency before returning success.
