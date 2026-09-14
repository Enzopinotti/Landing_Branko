import {
  CMS_CLIENT_ID_STORAGE_KEY,
  CMS_SESSION_STORAGE_KEY,
} from './config'
import type { CmsAdminSession } from './types'

const now = () => Date.now()

export function readAdminSession(): CmsAdminSession | null {
  try {
    const raw = sessionStorage.getItem(CMS_SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CmsAdminSession
    if (!parsed.token || !parsed.expiresAt || parsed.expiresAt <= now()) {
      clearAdminSession()
      return null
    }
    return parsed
  } catch {
    clearAdminSession()
    return null
  }
}

export function saveAdminSession(token: string, expiresInSeconds: number): CmsAdminSession {
  const session: CmsAdminSession = {
    token,
    expiresAt: now() + Math.max(1, expiresInSeconds) * 1000,
  }
  sessionStorage.setItem(CMS_SESSION_STORAGE_KEY, JSON.stringify(session))
  return session
}

export function clearAdminSession() {
  sessionStorage.removeItem(CMS_SESSION_STORAGE_KEY)
}

function randomOpaqueId(prefix: string) {
  const random = typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID().replace(/-/g, '')
    : `${Date.now()}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
  return `${prefix}_${random}`.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 120)
}

export function getOrCreateClientId() {
  const existing = localStorage.getItem(CMS_CLIENT_ID_STORAGE_KEY)
  if (existing && /^[A-Za-z0-9_-]{20,120}$/.test(existing)) return existing
  const created = randomOpaqueId('browser')
  localStorage.setItem(CMS_CLIENT_ID_STORAGE_KEY, created)
  return created
}
