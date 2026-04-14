# Blueprint Example Notes

Use these notes together with the good and bad examples.

## What the good example demonstrates

- approved use-case design is an input, not the markdown body's main structure
- the body follows the implementation route in the order a real implementer would cut the repo
- coverage against approved use cases is explicit, but brief and downstream of the route
- each route step begins from current-code friction instead of from tidy end-state summary
- each route step makes the first implementer move and first route cut visible
- each route step names at least one tempting wrong route
- shared route decisions are derived after the route is clear
- parallelization is derived, not forced
- repo grounding is attached where the route decision is made
- the authoritative blueprint artifact is written in English, while chat discussion may summarize the route in concise Chinese
- gap analysis and gate verdict belong in the chat-side review summary, not inside the blueprint artifact itself
- the chat summary is a compressed derivative of the full artifact draft, not the skeleton the artifact was written from

## What the bad example demonstrates

- `MVP spine` appears too early
- categories are mistaken for use cases
- implementation buckets masquerade as branch structure
- implementation difficulty is pushed downstream
- the implementer is told what should exist, but not where to start or what must be cut first
- approved use cases are re-listed as the body shape instead of being used to derive the route
- the draft is really a recommendation summary wearing blueprint headings
- the draft is really a process or flow specification sheet wearing blueprint headings
- the draft is really a simulated player journey wearing blueprint headings
- the draft is really a requirements or order bundle wearing blueprint headings

## Intended use

- read the good example before drafting a blueprint
- read `BLUEPRINT-REHEARSAL-TEMPLATE-V2.md` before drafting or revising a blueprint
- compare draft output against the bad example when it feels suspiciously neat or FAQ-shaped
- run `BLUEPRINT-GAP-ANALYSIS-V2.md` before treating the draft as gate-ready
- use the rubric as the final gate
