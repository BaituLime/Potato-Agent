# Godot-RUP Pilot Judgment Rules

Pilot judgment is workflow-level meta evaluation over real module outcomes.

It is not a fourth top-level runtime phase and it does not replace `Planning`, `Execution`, or `Acceptance` authority.

## 1. Inputs

Pilot judgment should prefer modules that already have:

- current-format exact passing acceptance evidence
- explicit ship/mainline integration
- `status = done`

Accepted-but-unshipped modules may inform discussion but should not dominate a final workflow keep/fix/rollback verdict.

## 2. Hard rules

- do not let pilot prose override module acceptance or ship truth
- do not relabel a module `done` or not-done merely because a pilot discussion changed mood
- do not use pilot review as hidden replanning of one module's approved route
- do not let one invalid pilot candidate decide the whole workflow verdict

## 3. Verdict classes

### `Keep`

Use when the rebuilt workflow proved trustworthy on real shipped modules and remaining issues are local polish.

### `Fix`

Use when the core authority and evidence model proved trustworthy, but real operational or contract issues still need targeted repair before broader rollout.

### `Rollback`

Use when pilot evidence shows constitutional failure in authority, proof, acceptance, or ship trust.

Rollback requires explicit corrective action. It is not a decorative label.
