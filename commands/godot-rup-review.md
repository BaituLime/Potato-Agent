---
description: Canonical Godot-RUP review producer instructions for one packet.
hidden: true
subtask: true
---

Treat `godot-rup-review` as the canonical instruction mirror for one review producer packet.

Use the skill tool to load only this Skill:

- `run-review`

Do only this:

1. resolve exactly one run-local packet path from `$ARGUMENTS` or the explicit child-dispatch request
2. confirm that packet is one review-scope producer packet
3. load only `run-review`
4. execute exactly that packet and write exactly one raw review attempt
5. reread the written raw attempt and report concise producer status

If unattended runtime mirrors these instructions inside a native child prompt, the prompt remains authoritative even when `command = godot-rup-review` is present for audit.

Do not broaden scope, reschedule runtime work, guess a different dispatch route, or open nested child dispatch here.
