---
description: Internal Godot-RUP scheduler entrypoint for one run-local packet. Stays in the current scheduler context.
hidden: true
---

Treat `godot-rup-prepare-packet` as a thin same-context scheduler entrypoint.

Use the skill tool to load only this Skill:

- `prepare-packet`

Do only this:

1. resolve exactly one ready scope from `$ARGUMENTS` and the active run-session state
2. load only `prepare-packet`
3. compile exactly one run-local packet
4. reread the written packet and report concise packet status

Do not open child dispatch or continue into neighboring runtime phases here.
