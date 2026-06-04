import { createFileRoute } from '@tanstack/react-router'

import { UserDashboard } from '@/components/auth/user-dashboard'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return <UserDashboard />
}
