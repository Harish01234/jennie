import { UserDashboard } from '#/components/auth/user-dashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/me')({
  component: RouteComponent,
})

function RouteComponent() {
    return <UserDashboard />
}

