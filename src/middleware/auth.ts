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

    const session = await auth.api.getSession({ headers: getRequestHeaders() })

    if (pathname === AUTH_LOGIN_PATH && session) throw redirect({ to: '/' })
    if (isPublicPath(pathname)) return next()
    if (!session) throw redirect({ to: AUTH_LOGIN_PATH })

    return next({ context: { session } })
  },
)
