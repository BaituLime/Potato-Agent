import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { tool } from "@opencode-ai/plugin/tool"
import {
  deleteSessionState,
  loadSessionState,
  resolveStateRoot,
  saveSessionState,
} from "./storage.js"

const DEFAULT_RECOVERY_WINDOW_MS = 5000
const DEFAULT_REINJECTION_COOLDOWN_MS = 5000
const DEFAULT_MAX_SAME_STATE_INJECTIONS = 3

function nowIso() {
  return new Date().toISOString()
}

function nowMs() {
  return Date.now()
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    return null
  }

  try {
    return JSON.parse(readFileSync(filePath, "utf8"))
  } catch {
    return null
  }
}

function getSessionIDFromEvent(properties) {
  if (!properties || typeof properties !== "object") {
    return undefined
  }

  if (typeof properties.sessionID === "string") {
    return properties.sessionID
  }

  if (properties.info && typeof properties.info === "object" && typeof properties.info.id === "string") {
    return properties.info.id
  }

  return undefined
}

function getRuntimePaths(state) {
  const runRoot = join(state.handoff_root, "runs", state.run_id)
  return {
    runRoot,
    sessionPath: join(runRoot, "session.json"),
    schedulerReturnPath: join(runRoot, "scheduler-return.json"),
    modulePaths: state.module_ids.map((moduleID) => [moduleID, join(runRoot, "modules", `${moduleID}.json`)]),
  }
}

function hasLegalStop(session, schedulerReturn) {
  if (!session || typeof session !== "object") {
    return false
  }

  if (bestStopReason(session, schedulerReturn) !== null && bestStopReason(session, schedulerReturn) !== undefined) {
    return true
  }

  return false
}

function bestStopReason(session, schedulerReturn) {
  if (session?.stop_reason) {
    return session.stop_reason
  }

  if (schedulerReturn?.recorded_stop_reason) {
    return schedulerReturn.recorded_stop_reason
  }

  return null
}

function hasProtocolBlocker(session, schedulerReturn) {
  if (schedulerReturn?.next_action === "fail_closed_protocol_blocker") {
    return true
  }

  if (schedulerReturn?.next_action === "surface_stop_to_user" && !bestStopReason(session, schedulerReturn)) {
    return true
  }

  return false
}

function buildStateSignature(session, modules) {
  return JSON.stringify({
    current_phase: session?.current_phase ?? null,
    yield_reason: session?.yield_reason ?? null,
    stop_reason: session?.stop_reason ?? null,
    modules,
  })
}

function buildContinuationPrompt(state, session, moduleSummaries) {
  const moduleList = state.module_ids.map((moduleID) => `- ${moduleID}`).join("\n")
  const moduleSummary = moduleSummaries
    .map((entry) => `- ${entry.module_id}: status=${entry.status}, graph_revision_id=${entry.graph_revision_id}`)
    .join("\n")

  return [
    "Godot-RUP unattended continuation is required.",
    "",
    `Run: ${state.run_id}`,
    `Handoff root: ${state.handoff_root}`,
    `Current phase: ${session?.current_phase ?? "unknown"}`,
    `Yield reason: ${session?.yield_reason ?? "null"}`,
    `Stop reason: ${session?.stop_reason ?? "null"}`,
    "",
    "Requested modules:",
    moduleList,
    "",
    "Current module runtime summary:",
    moduleSummary || "- no module summary available",
    "",
    "Reread the authoritative Godot-RUP runtime artifacts for this run and continue the unattended execution route.",
    "Do not surface to the user unless a real legal stop reason now exists.",
  ].join("\n")
}

async function resolveAgentAndModel(ctx, sessionID) {
  try {
    const response = await ctx.client.session.messages({
      path: { sessionID },
      query: { directory: ctx.directory },
    })

    const messages = response?.data ?? response ?? []
    if (!Array.isArray(messages)) {
      return {}
    }

    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const info = messages[index]?.info
      const agent = typeof info?.agent === "string" ? info.agent : undefined
      const model = info?.model && typeof info.model.providerID === "string" && typeof info.model.modelID === "string"
        ? { providerID: info.model.providerID, modelID: info.model.modelID }
        : undefined

      if (agent || model) {
        return { agent, model }
      }
    }
  } catch {
    return {}
  }

  return {}
}

async function injectContinuation(ctx, stateRoot, state, session, moduleSummaries) {
  const { agent, model } = await resolveAgentAndModel(ctx, state.session_id)
  const prompt = buildContinuationPrompt(state, session, moduleSummaries)

  await ctx.client.session.prompt({
    path: { sessionID: state.session_id },
    body: {
      ...(agent ? { agent } : {}),
      ...(model ? { model } : {}),
      parts: [{ type: "text", text: prompt }],
    },
    query: { directory: ctx.directory },
  })

  const updatedState = {
    ...state,
    last_injected_at: nowIso(),
    reinjection_count: (state.reinjection_count ?? 0) + 1,
  }
  saveSessionState(stateRoot, state.session_id, updatedState)
}

function touchActivity(stateRoot, sessionID) {
  const state = loadSessionState(stateRoot, sessionID)
  if (!state) {
    return
  }

  saveSessionState(stateRoot, sessionID, {
    ...state,
    last_activity_at: nowIso(),
  })
}

async function handleIdle(ctx, stateRoot, sessionID, options) {
  const state = loadSessionState(stateRoot, sessionID)
  if (!state || !state.active) {
    return
  }

  if (state.stopped) {
    return
  }

  if (state.hold_reason) {
    return
  }

  if (state.recovery_until && nowMs() < state.recovery_until) {
    return
  }

  if (state.last_injected_at) {
    const elapsed = nowMs() - Date.parse(state.last_injected_at)
    if (elapsed < options.reinjectionCooldownMs) {
      return
    }
  }

  const runtimePaths = getRuntimePaths(state)
  const session = readJson(runtimePaths.sessionPath)
  const schedulerReturn = readJson(runtimePaths.schedulerReturnPath)

  if (!session) {
    return
  }

  const moduleSummaries = runtimePaths.modulePaths.map(([moduleID, filePath]) => {
    const moduleSession = readJson(filePath)
    return {
      module_id: moduleID,
      status: moduleSession?.status ?? null,
      graph_revision_id: moduleSession?.graph_revision_id ?? null,
      ready_for_acceptance: moduleSession?.ready_for_acceptance ?? null,
    }
  })

  if (hasLegalStop(session, schedulerReturn)) {
    saveSessionState(stateRoot, sessionID, {
      ...state,
      active: false,
      stopped: true,
      stopped_reason: bestStopReason(session, schedulerReturn),
      hold_reason: null,
      last_activity_at: nowIso(),
    })
    return
  }

  if (hasProtocolBlocker(session, schedulerReturn)) {
    saveSessionState(stateRoot, sessionID, {
      ...state,
      hold_reason: "fail-closed-protocol-blocker",
      last_activity_at: nowIso(),
    })
    return
  }

  const signature = buildStateSignature(session, moduleSummaries)
  const sameStateInjectionCount = state.last_state_signature === signature
    ? (state.same_state_injection_count ?? 0) + 1
    : 1

  if (sameStateInjectionCount > options.maxSameStateInjections) {
    saveSessionState(stateRoot, sessionID, {
      ...state,
      hold_reason: "same-state-reinjection-limit",
      last_state_signature: signature,
      same_state_injection_count: sameStateInjectionCount,
      last_activity_at: nowIso(),
    })
    return
  }

  saveSessionState(stateRoot, sessionID, {
    ...state,
    last_state_signature: signature,
    same_state_injection_count: sameStateInjectionCount,
  })

  await injectContinuation(ctx, stateRoot, loadSessionState(stateRoot, sessionID), session, moduleSummaries)
}

export default async function GodotRupContinuationPlugin(ctx, rawOptions = {}) {
  const stateRoot = resolveStateRoot(rawOptions)
  const options = {
    recoveryWindowMs: rawOptions.recoveryWindowMs ?? DEFAULT_RECOVERY_WINDOW_MS,
    reinjectionCooldownMs: rawOptions.reinjectionCooldownMs ?? DEFAULT_REINJECTION_COOLDOWN_MS,
    maxSameStateInjections: rawOptions.maxSameStateInjections ?? DEFAULT_MAX_SAME_STATE_INJECTIONS,
  }

  return {
    name: "godot-rup-continuation",
    tool: {
      godot_rup_register_run: tool({
        description: "Register active Godot-RUP run for continuation enforcement",
        args: {
          run_id: tool.schema.string(),
          handoff_root: tool.schema.string(),
          module_ids: tool.schema.array(tool.schema.string()),
        },
        async execute(args, context) {
          const existing = loadSessionState(stateRoot, context.sessionID)
          const sameRun = existing?.run_id === args.run_id
          const nextState = {
            session_id: context.sessionID,
            run_id: args.run_id,
            handoff_root: args.handoff_root,
            module_ids: args.module_ids,
            active: true,
            stopped: false,
            stopped_reason: null,
            hold_reason: null,
            attached_at: sameRun ? existing?.attached_at ?? nowIso() : nowIso(),
            last_activity_at: nowIso(),
            last_injected_at: sameRun ? existing?.last_injected_at ?? null : null,
            recovery_until: null,
            reinjection_count: sameRun ? existing?.reinjection_count ?? 0 : 0,
            last_state_signature: null,
            same_state_injection_count: 0,
          }

          saveSessionState(stateRoot, context.sessionID, nextState)
          context.metadata({ title: `Registered Godot-RUP run ${args.run_id}` })
          return `Registered Godot-RUP continuation for run ${args.run_id}.`
        },
      }),
      godot_rup_set_continuation_stop: tool({
        description: "Set or clear explicit stop state for Godot-RUP continuation",
        args: {
          stopped: tool.schema.boolean(),
          reason: tool.schema.string().optional(),
        },
        async execute(args, context) {
          const existing = loadSessionState(stateRoot, context.sessionID)
          if (!existing) {
            return "No registered Godot-RUP run for this session."
          }

          saveSessionState(stateRoot, context.sessionID, {
            ...existing,
            stopped: args.stopped,
            stopped_reason: args.stopped ? args.reason ?? null : null,
            hold_reason: null,
            ...(args.stopped
              ? {}
              : {
                  last_state_signature: null,
                  same_state_injection_count: 0,
                }),
            last_activity_at: nowIso(),
          })
          context.metadata({ title: args.stopped ? "Continuation stopped" : "Continuation resumed" })
          return args.stopped ? "Godot-RUP continuation stopped." : "Godot-RUP continuation resumed."
        },
      }),
      godot_rup_clear_run_marker: tool({
        description: "Clear active Godot-RUP continuation marker for this session",
        args: {},
        async execute(_args, context) {
          deleteSessionState(stateRoot, context.sessionID)
          context.metadata({ title: "Cleared Godot-RUP run marker" })
          return "Cleared Godot-RUP continuation marker."
        },
      }),
    },
    event: async ({ event }) => {
      const sessionID = getSessionIDFromEvent(event.properties)
      if (!sessionID) {
        return
      }

      if (event.type === "session.deleted") {
        deleteSessionState(stateRoot, sessionID)
        return
      }

      if (event.type === "session.error") {
        const state = loadSessionState(stateRoot, sessionID)
        if (!state) {
          return
        }

        saveSessionState(stateRoot, sessionID, {
          ...state,
          recovery_until: nowMs() + options.recoveryWindowMs,
          last_activity_at: nowIso(),
        })
        return
      }

      if (event.type === "session.idle") {
        await handleIdle(ctx, stateRoot, sessionID, options)
      }
    },
    "chat.message": async (input) => {
      if (input?.sessionID) {
        touchActivity(stateRoot, input.sessionID)
      }
    },
    "tool.execute.before": async (input) => {
      touchActivity(stateRoot, input.sessionID)
    },
    "tool.execute.after": async (input) => {
      touchActivity(stateRoot, input.sessionID)
    },
  }
}
