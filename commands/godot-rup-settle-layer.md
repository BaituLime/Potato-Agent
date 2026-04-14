---
description: Internal Godot-RUP scheduler entrypoint for one drained layer settlement. Stays in the current scheduler context.
hidden: true
---

Treat `godot-rup-settle-layer` as a thin same-context scheduler entrypoint.

Use the skill tool to load only this Skill:

- `settle-layer`

Do only this:

1. resolve exactly one drained `module_id + layer_id` target from `$ARGUMENTS` and the active run-session state
2. load only `settle-layer`
3. perform `attest` then `gate` for exactly that layer
4. reread the written settlement output and report concise settlement status

Do not open child dispatch or continue into neighboring runtime phases here.
