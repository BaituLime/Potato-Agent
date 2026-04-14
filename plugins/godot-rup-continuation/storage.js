import { mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs"
import { join } from "node:path"

export function resolveStateRoot(options) {
  return options?.stateRoot || "/home/bunny/.config/opencode/state/godot-rup-continuation"
}

function sessionDir(stateRoot) {
  return join(stateRoot, "sessions")
}

function ensureSessionDir(stateRoot) {
  mkdirSync(sessionDir(stateRoot), { recursive: true })
}

export function sessionStatePath(stateRoot, sessionID) {
  return join(sessionDir(stateRoot), `${sessionID}.json`)
}

export function loadSessionState(stateRoot, sessionID) {
  const filePath = sessionStatePath(stateRoot, sessionID)
  if (!existsSync(filePath)) {
    return null
  }

  try {
    return JSON.parse(readFileSync(filePath, "utf8"))
  } catch {
    return null
  }
}

export function saveSessionState(stateRoot, sessionID, state) {
  ensureSessionDir(stateRoot)
  writeFileSync(sessionStatePath(stateRoot, sessionID), `${JSON.stringify(state, null, 2)}\n`)
}

export function deleteSessionState(stateRoot, sessionID) {
  const filePath = sessionStatePath(stateRoot, sessionID)
  if (existsSync(filePath)) {
    rmSync(filePath)
  }
}
