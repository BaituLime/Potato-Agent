---
name: integrate-main
description: Integrate an acceptance-cleared Module branch into the project mainline
compatibility: opencode
---

Use only these references:

- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/TERMS.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/RUN-SESSION-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-CONTRACT.md`
- `/home/bunny/.config/opencode/skills/Godot-RUP/godot-rup-common/HANDOFF-SKILL-SPEC.md`

Goal:

- advance one Module from validated acceptance state into the project mainline
- record the resulting runtime state

Read only:

- `decision/<module_id>.json`
- `graph/<module_id>.json`
- `runs/<run_id>/session.json`
- `runs/<run_id>/modules/<module_id>.json`
- `evidence/<module_id>/module-acceptance/summary.json`
- the explicit user approval to ship

Write only:

- project mainline git state
- `runs/<run_id>/session.json`
- `runs/<run_id>/modules/<module_id>.json`

Preconditions:

- module status is already `accepted`
- `evidence/<module_id>/module-acceptance/summary.json` already exists as current-format exact passing acceptance evidence
- final user approval to ship is explicit inside the active `godot-rup-acceptor` flow
- the Module integration branch is the approved source for shipping

Hard rules:

- integrate one Module at a time
- do not ship a Module whose acceptance is still unresolved
- do not treat stale status alone as sufficient ship authority when the acceptance summary is missing or no longer matches exact passing acceptance evidence
- do not reopen architecture or planning here
- treat this skill as a ship action, not another verification pass
- perform a real mainline integration; do not claim shipping by updating run-session files alone
- update the concrete run-session files so the Module status becomes `done` after successful shipping
- record the resulting mainline commit in the written module session state
- move `session.stop_reason` to `all_done` only when every requested module in that run is now `done`; otherwise keep the session truthful and do not overclaim full completion
- after successful shipping, the written module session state should no longer look acceptance-pending
- do not remove worktrees here; post-ship cleanup belongs to `cleanup-worktrees`

Consistency gate:

- after writing the run files, inspect the updated run state directly and confirm the shipped module is `done`, `last_mainline_commit` is recorded, and `session.stop_reason` reflects whether all requested modules are now done

Output:

- update the concrete run-session files for the shipped Module
- check the resulting run files for consistency
- return a concise result with Module identity, mainline integration result, and resulting `done` status
