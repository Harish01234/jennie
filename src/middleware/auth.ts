import { auth } from '@/lib/auth'
import { AUTH_LOGIN_PATH, isPublicPath } from '@/lib/auth-paths'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

export const authMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ request, next }) => {
    const pathname = new URL(request.url).pathname

    // skip static / dev assets
    if (pathname.startsWith('/_') || pathname.startsWith('/@') || pathname.includes('.')) {
      return next()
    }

    if (isPublicPath(pathname)) {
      if (pathname === AUTH_LOGIN_PATH) {
        const session = await auth.api.getSession({ headers: getRequestHeaders() })
        if (session) throw redirect({ to: '/' })
      }
      return next()
    }

    const session = await auth.api.getSession({ headers: getRequestHeaders() })
    if (!session) throw redirect({ to: AUTH_LOGIN_PATH })

    return next({ context: { session } })
  },
)

export const authFnMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) throw redirect({ to: AUTH_LOGIN_PATH })

    return next({ context: { session } })
  },
)
