---
description: Internal Godot-RUP scheduler entrypoint for one gated module-layer integration. Stays in the current scheduler context.
hidden: true
---

Treat `godot-rup-integrate-layer` as a thin same-context scheduler entrypoint.

Use the skill tool to load only this Skill:

- `integrate-layer`

Do only this:

1. resolve exactly one integration-gated `module_id + layer_id` target from `$ARGUMENTS` and the active run-session state
2. load only `integrate-layer`
3. integrate exactly that module-layer
4. reread the written integration record and report concise integration status

Do not open child dispatch or continue into neighboring runtime phases here.
