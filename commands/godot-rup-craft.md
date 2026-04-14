---
description: Canonical Godot-RUP craft producer instructions for one packet.
hidden: true
subtask: true
---

Treat `godot-rup-craft` as the canonical instruction mirror for one craft producer packet.

Use the skill tool to load only this Skill:

- `run-craft`

Do only this:

1. resolve exactly one run-local packet path from `$ARGUMENTS` or the explicit child-dispatch request
2. confirm that packet is one craft-scope producer packet
3. load only `run-craft`
4. execute exactly that packet in the assigned checkout and write exactly one raw attempt
5. reread the written raw attempt and report concise producer status

If unattended runtime mirrors these instructions inside a native child prompt, the prompt remains authoritative even when `command = godot-rup-craft` is present for audit.

Do not broaden scope, reschedule runtime work, guess a different dispatch route, or open nested child dispatch here.
