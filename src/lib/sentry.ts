// Sentry integration - initialize in main.tsx
// Requires VITE_SENTRY_DSN env var and @sentry/react installed
// Install: pnpm add @sentry/react

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const __SENTRY_LOADED__: boolean
let SentryModule: any = null

async function getSentry() {
  if (SentryModule) return SentryModule
  try {
    const mod = await import(/* webpackIgnore: true */ '@sentry/react' as string)
    SentryModule = mod
    return mod
  } catch {
    return null
  }
}

export async function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) return
  const Sentry = await getSentry()
  if (!Sentry) return
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE || 'development',
    tracesSampleRate: 0.2,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })
}

export async function captureError(error: Error, _context?: Record<string, any>) {
  const Sentry = await getSentry()
  if (!Sentry) return
  Sentry.captureException(error)
}

export async function captureMessage(message: string, _level: 'info' | 'warning' | 'error' = 'info') {
  const Sentry = await getSentry()
  if (!Sentry) return
  Sentry.captureMessage(message)
}

export async function setUserContext(userId: string, email?: string) {
  const Sentry = await getSentry()
  if (!Sentry) return
  Sentry.setUser({ id: userId, email })
}

export async function clearUserContext() {
  const Sentry = await getSentry()
  if (!Sentry) return
  Sentry.setUser(null)
}
