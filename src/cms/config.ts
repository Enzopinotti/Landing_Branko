export const CMS_WEB_APP_URL = (
  import.meta.env.VITE_CMS_WEB_APP_URL?.trim() ||
  'https://script.google.com/macros/s/AKfycbyMl-xSTGLAOL0LkGR6SLGkVSgfOrjbJ22ishAeSLs5M9071fpvGBJjAfj1KnVOLBsg/exec'
).replace(/\/+$/, '')

export const CMS_POLL_INTERVAL_MS = 400
export const CMS_POLL_ATTEMPTS = 20
export const CMS_JSONP_TIMEOUT_MS = 12_000
export const CMS_SESSION_STORAGE_KEY = 'branko-cms-admin-session'
export const CMS_CLIENT_ID_STORAGE_KEY = 'branko-cms-client-id'
