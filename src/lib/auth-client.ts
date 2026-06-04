import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  // Same origin in dev — avoids localhost vs 127.0.0.1 cookie mismatch
})
