export const AUTH_LOGIN_PATH = '/signin'

const PUBLIC_PATHS = ['/signin', '/about', '/api/inngest']

export function isPublicPath(pathname: string) {
  return (
    PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/api/auth')
  )
}
