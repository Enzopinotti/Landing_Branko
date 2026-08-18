import {
  CMS_JSONP_TIMEOUT_MS,
  CMS_POLL_ATTEMPTS,
  CMS_POLL_INTERVAL_MS,
  CMS_WEB_APP_URL,
} from './config'
import type {
  CmsAdminResultEnvelope,
  CmsCollectionKey,
  CmsLoginResponse,
  CmsMediaLink,
  CmsMutationResponse,
  CmsPublicBootstrapResponse,
  CmsSettings,
  CmsWorkspaceResponse,
} from './types'

export class CmsClientError extends Error {
  code?: string

  constructor(message: string, code?: string) {
    super(message)
    this.name = 'CmsClientError'
    this.code = code
  }
}

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

function opaqueId(prefix: string) {
  const random = typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID().replace(/-/g, '')
    : `${Date.now()}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
  return `${prefix}_${random}`.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 120)
}

function errorFromResult(result: { error?: string; code?: string } | undefined, fallback: string) {
  return new CmsClientError(result?.error || fallback, result?.code)
}

function jsonp<T>(params: Record<string, string>): Promise<T> {
  return new Promise((resolve, reject) => {
    const callbackName = `__brankoCms_${opaqueId('cb').replace(/[^A-Za-z0-9_$]/g, '')}`
    const url = new URL(CMS_WEB_APP_URL)
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))
    url.searchParams.set('callback', callbackName)

    const script = document.createElement('script')
    const scope = window as typeof window & Record<string, unknown>
    let settled = false

    const cleanup = () => {
      if (script.parentNode) script.parentNode.removeChild(script)
      delete scope[callbackName]
    }

    const finish = (callback: () => void) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeout)
      cleanup()
      callback()
    }

    scope[callbackName] = (payload: T) => finish(() => resolve(payload))
    script.async = true
    script.src = url.toString()
    script.onerror = () => finish(() => reject(new CmsClientError('No se pudo conectar con el CMS.')))

    const timeout = window.setTimeout(
      () => finish(() => reject(new CmsClientError('El CMS tardó demasiado en responder.'))),
      CMS_JSONP_TIMEOUT_MS,
    )

    document.head.appendChild(script)
  })
}

async function pollAdminResult<T>(requestId: string, clientSecret: string) {
  for (let attempt = 0; attempt < CMS_POLL_ATTEMPTS; attempt += 1) {
    const envelope = await jsonp<CmsAdminResultEnvelope<T>>({
      api: 'admin-result',
      requestId,
      clientSecret,
    })

    if (envelope.success && envelope.pending === false) {
      if (envelope.result === undefined) throw new CmsClientError('El CMS devolvió una respuesta vacía.')
      return envelope.result
    }

    if (!(envelope.success && envelope.pending === true)) {
      throw errorFromResult(envelope, 'No se pudo recuperar la respuesta administrativa.')
    }

    await sleep(CMS_POLL_INTERVAL_MS)
  }

  throw new CmsClientError('El CMS no confirmó la operación a tiempo.')
}

async function adminCommand<T>(operation: string, token: string, payload: Record<string, unknown>) {
  const requestId = opaqueId('req')
  const clientSecret = opaqueId('secret')

  await fetch(CMS_WEB_APP_URL, {
    method: 'POST',
    mode: 'no-cors',
    redirect: 'follow',
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
    },
    body: JSON.stringify({
      action: 'adminCommand',
      operation,
      token,
      payload,
      requestId,
      clientSecret,
    }),
  })

  return pollAdminResult<T>(requestId, clientSecret)
}

export const cmsClient = {
  endpoint: CMS_WEB_APP_URL,

  async bootstrap() {
    const result = await jsonp<CmsPublicBootstrapResponse>({ api: 'bootstrap' })
    if (!result.success || !result.data) throw errorFromResult(result, 'No se pudo cargar el contenido público.')
    return result.data
  },

  async login(password: string, clientId: string) {
    const result = await adminCommand<CmsLoginResponse>('login', '', { password, clientId })
    if (!result.success || !result.token || !result.expiresIn) throw errorFromResult(result, 'No se pudo iniciar sesión.')
    return result
  },

  async logout(token: string) {
    const result = await adminCommand<CmsMutationResponse>('logout', token, {})
    if (!result.success) throw errorFromResult(result, 'No se pudo cerrar la sesión.')
    return result
  },

  async workspace(token: string) {
    const result = await adminCommand<CmsWorkspaceResponse>('workspace', token, {})
    if (!result.success || !result.data) throw errorFromResult(result, 'No se pudo cargar el panel.')
    return result.data
  },

  async changePassword(token: string, currentPassword: string, newPassword: string) {
    const result = await adminCommand<CmsMutationResponse>('changePassword', token, {
      currentPassword,
      newPassword,
    })
    if (!result.success || !result.token || !result.expiresIn) throw errorFromResult(result, 'No se pudo cambiar la contraseña.')
    return result
  },

  async saveSettings(token: string, record: Partial<CmsSettings>) {
    const result = await adminCommand<CmsMutationResponse<CmsSettings>>('saveSettings', token, { record })
    if (!result.success || !result.record) throw errorFromResult(result, 'No se pudieron guardar los datos generales.')
    return result.record
  },

  async saveContent(token: string, record: Record<string, unknown>) {
    const result = await adminCommand<CmsMutationResponse>('saveContent', token, { record })
    if (!result.success || !result.record) throw errorFromResult(result, 'No se pudo guardar el contenido.')
    return result.record
  },

  async createRecord(token: string, tableKey: CmsCollectionKey, record: Record<string, unknown>) {
    const result = await adminCommand<CmsMutationResponse>('createRecord', token, { tableKey, record })
    if (!result.success || !result.record) throw errorFromResult(result, 'No se pudo crear el registro.')
    return result.record
  },

  async updateRecord(token: string, tableKey: CmsCollectionKey, id: string, record: Record<string, unknown>) {
    const result = await adminCommand<CmsMutationResponse>('updateRecord', token, { tableKey, id, record })
    if (!result.success || !result.record) throw errorFromResult(result, 'No se pudo actualizar el registro.')
    return result.record
  },

  async archiveRecord(token: string, tableKey: CmsCollectionKey, id: string) {
    const result = await adminCommand<CmsMutationResponse>('archiveRecord', token, { tableKey, id })
    if (!result.success) throw errorFromResult(result, 'No se pudo archivar el registro.')
    return result
  },

  async restoreRecord(token: string, tableKey: CmsCollectionKey, id: string) {
    const result = await adminCommand<CmsMutationResponse>('restoreRecord', token, { tableKey, id })
    if (!result.success) throw errorFromResult(result, 'No se pudo restaurar el registro.')
    return result
  },

  async uploadMedia(token: string, payload: Record<string, unknown>) {
    const result = await adminCommand<CmsMutationResponse>('uploadMedia', token, payload)
    if (!result.success || !result.media) throw errorFromResult(result, 'No se pudo subir la imagen.')
    return result.media
  },

  async linkMedia(token: string, payload: Record<string, unknown>) {
    const result = await adminCommand<CmsMutationResponse<CmsMediaLink>>('linkMedia', token, payload)
    if (!result.success || !result.link) throw errorFromResult(result, 'No se pudo vincular la imagen.')
    return result.link
  },

  async unlinkMedia(token: string, mediaLinkId: string) {
    const result = await adminCommand<CmsMutationResponse>('unlinkMedia', token, { mediaLinkId })
    if (!result.success) throw errorFromResult(result, 'No se pudo desvincular la imagen.')
    return result
  },

  async archiveMedia(token: string, mediaId: string) {
    const result = await adminCommand<CmsMutationResponse>('archiveMedia', token, { mediaId })
    if (!result.success) throw errorFromResult(result, 'No se pudo archivar la imagen.')
    return result
  },
}
