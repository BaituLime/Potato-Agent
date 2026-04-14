---
name: context-discovery
description: Discover stable project facts, tools, and constraints for Godot-RUP C#
compatibility: opencode
---

# Context Discovery (Godot-RUP + C#)

Use this Skill to discover and persist stable project facts before architecture or graph planning.

Canonical references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/TERMS.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-SKILL-SPEC.md`

## Goal

Produce or refresh the `Context Handoff` only.

This Skill discovers facts. It does not approve decisions, design the workflow, or split tasks.

## Write boundary

You may write only:

- `Context Handoff`

Do not write:

- `Decision Handoff`
- `Graph Handoff`
- runtime artifacts under `runs/<run_id>/`

## Discover

- repo root and mainline branch naming
- `project.godot`, Godot root, main scene, C# usage, and enabled plugins/autoloads
- in-repo architecture docs, conventions, and authoritative references
- reusable systems, existing ownership boundaries, and obvious integration points
- global resource locks, especially Godot MCP single-client constraints when present
- exact concurrency truth for constrained runtime resources: whether MCP is single-client, per-project-path, or safely parallelizable in this environment
- whether MCP-consuming scopes must own editor bootstrap and teardown locally instead of depending on a pre-opened shared editor session
- which Godot UI, scene, animation, or interaction surfaces are unlikely to converge honestly without editor/MCP-backed craft work during implementation
- project-local tools and knowledge sources, including custom tools, RAG-backed sources, databases, MCP servers, and utility scripts
- test-related entry points or scenes that later planning may reuse
- user-stated success semantics when they are already knowable from the request, especially whether the desired outcome is operator-visible behavior, reusable project structure, or both
- proof-boundary facts: which available tools and entry points can prove scene structure, which can prove live runtime behavior, and which may not substitute for each other
- factual blockers, missing prerequisites, or unclear authority sources

## Discovery posture

- Reread the canonical common workflow docs before inheriting assumptions from existing handoff artifacts.
- Prefer direct evidence over assumptions.
- Record authority level when a source is weak or secondary.
- If module-specific discovery is requested, still keep repo-global facts separate from module-local notes.
- Treat older handoff files as candidate context, not as the source of workflow law. If they conflict with active common docs or schemas, keep the contract and mark the handoff stale.
- Keep discovered project facts separate from inferred completion semantics.
- If the request could mean either "the user must be able to experience this behavior" or merely "the project must contain this structure," surface that ambiguity explicitly instead of silently choosing one.
- If a fact is uncertain, mark it uncertain instead of promoting it to truth.
- The final discovery synthesis normally stays in the current planning context; if you split off narrow file-hunting or evidence-lookup subtasks, keep them read-only and as lightweight as safely possible.

## Question policy

Ask only when a required fact cannot be discovered safely from the project and the missing answer will materially affect planning.

This includes unresolved behavior-versus-structure completion semantics when later planning would otherwise have to guess.

## Do not

- choose the technical route
- choose workflow steps
- split Atomic Tasks
- assign per-task `model_tier` or `reasoningEffort`
- select review targets
- silently turn guesses into Handoff truth

## Output

1. Update the `Context Handoff`.
2. Return a concise summary with:
   - discovered tools and knowledge sources
   - reusable systems and ownership clues
   - hard constraints and global locks
   - success-semantics clues and proof-boundary notes
   - factual blockers or unknowns that remain
