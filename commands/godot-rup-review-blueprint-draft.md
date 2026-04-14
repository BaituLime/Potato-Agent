---
description: Canonical Godot-RUP strict review instructions for one blueprint draft.
hidden: true
subtask: true
---

Treat `godot-rup-review-blueprint-draft` as the canonical instruction mirror for one strict blueprint draft review.

This command is meant for fresh child review dispatch from a main planning chat.

Use the skill tool to load only this Skill:

- `blueprint-draft-review`

Do only this:

1. resolve exactly one blueprint draft markdown path from `$ARGUMENTS` or the explicit child-dispatch request
2. confirm the path is one `blueprint/<module_id>.draft.md`
3. load only `blueprint-draft-review`
4. execute exactly one strict review of that draft and write exactly one temporary review file
5. return only the temporary review file path, findings count, and review verdict

Do not revise the draft, broaden scope, guess missing planning truth, or use a happy-path review posture here.
