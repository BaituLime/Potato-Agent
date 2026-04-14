# Good Execution Blueprint Example

This is the canonical positive exemplar.

It is not project truth.

It exists to show the default blueprint shape: use-case design is an approved input, but the markdown body follows the implementation route rather than restating use cases one by one.

## Scenario

Assume the approved use-case design already defines three operator-facing anchors:

- enter the host and understand what is actionable
- deepen from transient preview into stable inspect
- pin one item and compare against another without losing the baseline

Those anchors are inputs.

The blueprint body should now explain how the repo should actually be cut.

## Implementation Route

### Step 1: establish host-owned first impression and mount occupancy

#### Current-Code Friction

The reusable shell chrome still encourages several equal-weight windows. If implementation starts from widget polish, the host will keep weak first-impression pacing and the operator will have to infer what matters by scanning chrome.

#### If I Were Landing This

I would start by reading `Scene/UI/Shared/UiShellChrome.tscn` and `Script/Presentation/UI/Orchestration/GameplayUiRuntime.cs`, because the first question is not content. The first question is who owns initial emphasis and mount occupancy.

#### First Route Cut

Reject the many-equal-panels opening state. The host must enter with one visible item list, one focused detail mount, and one compact shell hint area.

#### Route After That Cut

After that cut, the host owns first-impression pacing. Widgets may render the current focal item, but they do not decide what should be emphasized first.

#### Tempting Wrong Route

Open several example panels at once so the scene looks feature-rich immediately. That feels productive, but it destroys pacing and pushes the most important route judgment downstream into widget clutter.

#### What Must Remain True

- the host owns first-impression pacing
- the host owns mount occupancy
- widget instances render the decision, but do not own it

#### Repo Grounding

- `Scene/UI/Shared/UiShellChrome.tscn`
- `Script/Presentation/UI/Orchestration/GameplayUiRuntime.cs`

### Step 2: split transient preview from durable inspect

#### Current-Code Friction

Preview and stable inspect are easy to collapse because the same payload appears in more than one surface. If hover writes into durable selection state, the scene looks coherent at first but the semantics have already merged.

#### If I Were Landing This

I would next read `Script/Presentation/UI/Orchestration/GameplayUiRuntime.cs`, `Scene/UI/Shared/UiTooltipChrome.tscn`, and `Scene/UI/Shared/UiHoverCardChrome.tscn`, because the next question is where preview ends and inspect begins.

#### First Route Cut

Refuse hover as a durable selection path. Hover may create preview state, but only explicit select may promote an item into stable inspect context.

#### Route After That Cut

After that cut, tooltip and hover-card become two depths of preview instead of two competing durable states. Runtime owns durable inspect semantics, while the shell owns preview visibility and cleanup.

#### Tempting Wrong Route

Let hover update the same selected-item state that stable inspect uses. That saves one state shape in the short term, but it guarantees drift and brittle cleanup later.

#### What Must Remain True

- preview stays transient
- stable inspect stays deliberate
- widget lifecycle may not become payload authority

#### Repo Grounding

- `Script/Presentation/UI/Orchestration/GameplayUiRuntime.cs`
- `Scene/UI/Shared/UiTooltipChrome.tscn`
- `Scene/UI/Shared/UiHoverCardChrome.tscn`

### Step 3: separate pinned compare truth from panel lifecycle

#### Current-Code Friction

Compare state is easy to fake by reading whatever panel happens to be mounted now. That shortcut breaks the moment the active target changes.

#### If I Were Landing This

I would then read `Script/Presentation/UI/Orchestration/GameplayUiRuntime.cs` and `Script/Presentation/UI/Orchestration/GameplayUiService.cs`, because the next route question is whether compare truth survives panel churn through stable ids or only through widget lifecycle.

#### First Route Cut

Reject the mounted-panel-as-truth shortcut. Pinned compare state must store stable item ids rather than deriving itself from whichever detail panel is currently visible.

#### Route After That Cut

After that cut, runtime owns active inspect state, compare storage owns pinned baseline ids, and payload lookup resolves both without widget instances becoming authority.

#### Tempting Wrong Route

Derive the compare tray from the currently mounted detail panel because it already has the payload in memory. That looks cheap, but it ties compare truth to panel churn and guarantees loss on target switch.

#### What Must Remain True

- active inspect truth and pinned compare truth stay separate
- temporary preview cleanup may not clear pinned compare state
- widget instances render payload; they do not own compare identity

#### Repo Grounding

- `Script/Presentation/UI/Orchestration/GameplayUiRuntime.cs`
- `Script/Presentation/UI/Orchestration/GameplayUiService.cs`

### Step 4: converge the route around one payload authority and two explicit UI modes

#### Current-Code Friction

Even after the first cuts, the repo can still drift if preview, inspect, and compare are left as separate local tricks instead of one coherent route.

#### If I Were Landing This

I would finish by rereading the host runtime plus the state owners named above, because the final question is whether the module now has one coherent implementation path or only several local fixes.

#### First Route Cut

Reject any remaining shortcut that lets shell or widget code reconstruct payload authority from local presentation state.

#### Route After That Cut

The final route is simple in the right way:

- the host owns first impression and shell grammar
- runtime owns durable inspect semantics
- compare storage owns pinned baseline truth
- widgets render those truths without re-owning them

#### Tempting Wrong Route

Keep each surface locally coherent and assume the overall route will emerge later. That produces a tidy-looking module with no single explicit ownership path.

#### What Must Remain True

- payload authority is stable
- preview is not inspect
- compare is not widget lifecycle residue
- downstream execution can inherit the route without rediscovering ownership

#### Repo Grounding

- `Script/Presentation/UI/Orchestration/GameplayUiRuntime.cs`
- `Script/Presentation/UI/Orchestration/GameplayUiService.cs`

## Coverage Against Approved Use Cases

- approved entry clarity is covered by Steps 1 and 2
- approved preview-to-inspect behavior is covered by Steps 2 and 4
- approved pinned-compare behavior is covered by Steps 3 and 4

This section stays brief.

It proves that the approved use-case design is covered by the implementation route.

It is not the main body of the blueprint.

## Shared Route Decisions

- the host owns scene topology, shell mounts, and shell grammar
- runtime owns durable inspect semantics
- compare storage owns pinned baseline identity
- widget instances render truth but do not become truth owners

## Derived Parallelization And Convergence

- host-owned first impression must settle before deeper inspect behavior is exercised
- compare work may branch only after durable inspect truth is already explicit
- all routes converge back into one rule: stable payload authority with non-owning UI surfaces

## Out Of Scope

- reusable inventory framework productization
- persistent cross-session key rebinding
- extra decorative polish beyond the host's actual interaction needs

## Open Questions

- none for this exemplar
