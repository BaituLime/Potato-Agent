---
description: Run exactly one rebuilt Godot-RUP internal slice directly for manual operator control. Use when the user explicitly wants one named runtime or acceptance slice instead of the full top-level surface.
---
Reply in the user's language.

Treat `godot-rup-step` as a thin manual entrypoint for exactly one rebuilt slice.

Requested slice: `$ARGUMENTS`

Use the skill tool to load only the one explicitly requested slice from this list:

- `compose-runtime-dag`
- `allocate-worktrees`
- `orchestrate-runtime`
- `assemble-acceptance-dossier`
- `accept-module`

Dedicated internal command entrypoints exist for these narrower machine-facing slices and should be invoked directly instead of routing through `godot-rup-step`:

- `godot-rup-prepare-packet`
- `godot-rup-task`
- `godot-rup-proof`
- `godot-rup-review`
- `godot-rup-settle-layer`
- `godot-rup-integrate-layer`

Do only this:

1. resolve exactly one requested slice from `$ARGUMENTS` or the user's explicit request
2. if the request is missing or ambiguous, stop and ask for exactly one slice name from the allowed list
3. if the request names one of the dedicated internal command entrypoints listed above, stop and direct the operator to invoke that command directly instead of routing it through `godot-rup-step`
4. load only that one slice skill
5. execute only that slice and preserve its own contract, authority boundaries, and stop policy
6. stop as soon as that slice finishes or reaches its own gate
