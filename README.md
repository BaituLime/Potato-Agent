20260418：之前只是听说OMO很好用，但是我自己用了发现，烧了巨量Token生成了一坨，Token损耗是递增的，纠偏计划消耗更多Token能做的也有限，那么还是回到我这一套上来。
# Godot-RUP
An archived experiment in building a highly planned OpenCode workflow for migrating Unity game systems into Godot, one module at a time.
说白了我就是在Github找个坑给埋了，我已经把这个流程打磨的挺不错、好使了，可惜我发现了OMO，它更好使。既然知道是在造轮子，就不能继续偏执地造轮子，不过我这套经过一个多月的打磨，已经好使了，它至少可以做到职责分离、计划细节控制、流程细节预设计、上下文切分、MVP切割并行、多Module拼层、有限自动审核修复，挺可惜的。
## Status
This repository is currently **archived as an experiment**, not maintained as an actively recommended workflow.
I am keeping it public mainly for:
- documenting the design ideas
- preserving the migration artifacts and workflow contracts
- sharing what worked and what did not
- serving as a reference for future, thinner Godot-specific skills
## Why This Exists
I originally wanted a workflow that could help migrate a Unity project into Godot in a disciplined, modular way.
The goal was not just "write code automatically", but to make the AI work under stronger constraints:
- plan before acting
- preserve module boundaries
- keep decisions explicit
- make execution auditable
- separate planning, execution, and acceptance
- support long-running work with recoverable state
This repository is the result of that attempt.
## What Is In This Repo
The system grew into a custom OpenCode workflow with several layers:
- top-level agents for planning, execution, and acceptance
- custom commands that load bounded workflow skills
- a large `Godot-RUP` skill set covering planning, runtime orchestration, and acceptance
- a continuation plugin for run registration and stop/resume enforcement
- handoff artifacts from real migration work
At a high level, the workflow tried to move through:
1. planning
2. execution
3. settlement
4. integration
5. acceptance
## Repository Layout
- `agents/`
  Top-level surfaces such as planner, runner, acceptor, and execution profiles.
- `commands/`
  Thin command entrypoints for bounded workflow actions.
- `skills/Godot-RUP/`
  The main workflow library. This includes planning skills, runtime skills, acceptance skills, and shared contracts.
- `plugins/godot-rup-continuation/`
  A local OpenCode plugin for continuation and stop-state handling.
## What Worked
Some parts of this experiment were genuinely useful:
- it forced important migration assumptions into explicit documents
- it made module boundaries and proof expectations clearer
- it improved planning quality compared to naive autonomous code generation
- it captured real Unity-to-Godot migration knowledge from actual work
Even where the execution framework became too heavy, the understanding gained from building it was valuable.
## What Did Not Work Well
The main problem is that the execution side became too ambitious for its practical value.
In particular:
- the runtime grew heavy and fragile
- the maintenance cost was too high for a solo developer
- parts of the system duplicated general orchestration features that newer public tools already provide
- the execution layer introduced a large bug surface relative to the actual speed gains
In short: the domain knowledge was useful, but the custom execution platform was overbuilt.
## Why This Repo Is Archived
After building and iterating on this workflow, I concluded that the best path forward is likely:
- keep the migration knowledge
- keep only thin Godot-specific constraints where they matter
- stop maintaining a large custom execution runtime
- rely on stronger general-purpose orchestration tools for actual execution
This repository is therefore best read as:
- a design record
- a workflow experiment
- a source of ideas and contracts
- not a polished product
## If You Want To Reuse Anything
The parts most likely worth reusing are:
- migration planning ideas
- module-level briefs and blueprints
- Godot-specific checklists
- acceptance and verification thinking
- narrow skills extracted from the larger system
The parts least likely worth copying directly are:
- the full custom execution runtime
- the continuation/plugin coupling
- the heavier packet/layer/worktree orchestration model
- the entire planning-to-acceptance stack as-is
## Notes
This repository may contain local-path assumptions, project-specific artifacts, and experimental workflow decisions that were never generalized.
Treat it as a reference archive, not a drop-in framework.
# Godot-RUP Technical Notes
This document explains what Godot-RUP was trying to do, how it was structured, and why it eventually became an archived experiment instead of a long-term workflow.
## Design Goal
Godot-RUP was designed as a specialized OpenCode workflow for migrating Unity game systems into Godot with stronger process control.
The intended properties were:
- planning before execution
- explicit module boundaries
- reproducible handoff artifacts
- recoverable long-running execution
- auditable execution records
- separated planning, execution, and acceptance authority
It was built for a real migration context, not as a generic AI workflow toy.
## High-Level Architecture
The system was split into three top-level surfaces:
- `godot-rup-planner`
  Planning-only surface.
- `godot-rup-runner`
  Execution-only surface and root unattended runner.
- `godot-rup-acceptor`
  Acceptance-only surface.
These surfaces were backed by a large skill library under `skills/Godot-RUP/`.
## Planning Layer
The planning side was responsible for turning vague migration work into structured artifacts.
Key skills included:
- `context-discovery`
- `use-case-design`
- `architecture-review`
- `execution-blueprint`
- `workflow-design`
- `dag-plan`
- `repair-delta-plan`
The planning output was meant to define:
- what the module must do
- what route the implementation should follow
- how work could be split safely
- what evidence would count as sufficient proof
## Execution Layer
The execution side attempted to run unattended work under stronger runtime control.
Key skills included:
- `compose-runtime-dag`
- `allocate-worktrees`
- `orchestrate-runtime`
- `prepare-packet`
- `run-task`
- `run-craft`
- `run-proof`
- `run-review`
- `settle-layer`
- `integrate-layer`
- `cleanup-run-worktrees`
Important ideas in this layer included:
- combined runtime DAGs
- layer-based admission and settlement
- packetized leaf-worker dispatch
- isolated worktrees
- strict authority boundaries
- fail-fast proof and review behavior
This was the most ambitious and most expensive part of the system.
## Acceptance Layer
The acceptance side was designed to avoid "chat momentum means done".
Key skills included:
- `assemble-acceptance-dossier`
- `prepare-user-review-brief`
- `record-user-review-gate`
- `accept-module`
- `integrate-main`
- `cleanup-worktrees`
The intended model was:
1. execution produces raw attempts
2. settlement produces authoritative layer results
3. acceptance rereads evidence and review gates
4. only then can a module be accepted
5. shipping remains a separate action
## Continuation Plugin
The repository also includes a local plugin:
- `plugins/godot-rup-continuation/`
This plugin existed to support things such as:
- active run registration
- stop-state enforcement
- continuation and reinjection behavior
- resume discipline for unattended execution
It was tightly coupled to the execution model and is one of the clearest examples of how the system expanded beyond a thin skill layer into a custom runtime.
## Why It Became Too Heavy
The system was aiming to solve many problems at once:
- migration planning
- unattended execution
- safe task decomposition
- runtime continuation
- worktree allocation
- review and acceptance governance
That produced a large coordination surface.
In practice, several problems emerged:
- the execution model was expensive to maintain
- bug surface grew faster than productivity gains
- local workflow complexity became a project of its own
- parts of the runtime duplicated capabilities later available in general-purpose orchestration frameworks
For a solo developer trying to ship an actual game, this was too much toolsmithing relative to the value returned.
## What Still Seems Valuable
Even after archiving the full workflow, several ideas still seem worth preserving:
- strong module briefs
- explicit use-case design before implementation
- migration-specific constraints and checklists
- proof-oriented thinking instead of pure prompt optimism
- a clear distinction between "implemented" and "verified"
These are the pieces most likely to survive as thinner skills or templates.
## What I Would Not Rebuild The Same Way
If rebuilding this from scratch, I would not immediately recreate:
- the full custom execution runtime
- the continuation plugin as a core dependency
- the heavier DAG/layer/packet machinery as a default workflow
- the complete planning-to-acceptance system for every task
Instead, I would start with:
- a thin module brief
- a thin Godot migration checklist
- a smaller set of domain-specific skills
- a general-purpose external orchestration harness
## Intended Reading
This repository should be understood as:
- a serious workflow experiment
- a record of one developer's attempt to systematize Unity-to-Godot migration
- a source of reusable ideas
- not a finished or recommended platform
