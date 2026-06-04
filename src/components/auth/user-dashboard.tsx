import type { ComponentType, ReactNode } from 'react'
import { format } from 'date-fns'
import { Calendar, Clock, Mail, ShieldCheck, User } from 'lucide-react'

import { authClient } from '@/lib/auth-client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

function getUserInitials(name?: string | null, email?: string | null) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  if (email) return email[0].toUpperCase()
  return '?'
}

function formatDate(value: string | Date | null | undefined) {
  if (!value) return '—'
  try {
    return format(new Date(value), 'PPp')
  } catch {
    return '—'
  }
}

function DetailRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
        <Icon className="size-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p
          className={
            mono
              ? 'truncate font-mono text-sm text-foreground'
              : 'text-sm font-medium text-foreground'
          }
        >
          {value}
        </p>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-lg" />
        <Skeleton className="h-72 rounded-lg" />
      </div>
    </div>
  )
}

export function UserDashboard() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return <DashboardSkeleton />
  if (!session?.user) return null

  const { user, session: authSession } = session
  const displayName = user.name ?? 'User'
  const initials = getUserInitials(user.name, user.email)

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
          Welcome back,{' '}
          <span className="text-primary">{displayName.split(' ')[0]}</span>
        </h1>
        <p className="text-muted-foreground">
          Your profile and active session details
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle>Profile</CardTitle>
            <CardDescription>Account information from your provider</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center gap-4">
              <Avatar size="lg" className="size-16">
                {user.image ? (
                  <AvatarImage src={user.image} alt={displayName} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 space-y-2">
                <p className="truncate text-lg font-semibold">{displayName}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge>Active</Badge>
                  {user.emailVerified ? (
                    <Badge variant="outline" className="gap-1">
                      <ShieldCheck className="size-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline">Unverified</Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <DetailRow icon={Mail} label="Email" value={user.email ?? '—'} />
              <DetailRow icon={User} label="User ID" value={user.id} mono />
              {user.createdAt ? (
                <DetailRow
                  icon={Calendar}
                  label="Member since"
                  value={formatDate(user.createdAt)}
                />
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle>Session</CardTitle>
            <CardDescription>Current sign-in session metadata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {authSession ? (
              <>
                <DetailRow
                  icon={Clock}
                  label="Expires"
                  value={formatDate(authSession.expiresAt)}
                />
                <DetailRow
                  icon={Calendar}
                  label="Created"
                  value={formatDate(authSession.createdAt)}
                />
                <DetailRow
                  icon={ShieldCheck}
                  label="Session ID"
                  value={authSession.id}
                  mono
                />
                {authSession.ipAddress ? (
                  <DetailRow
                    icon={User}
                    label="IP address"
                    value={authSession.ipAddress}
                    mono
                  />
                ) : null}
                {authSession.userAgent ? (
                  <div className="rounded-lg border border-border bg-muted/50 p-3">
                    <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      User agent
                    </p>
                    <p className="line-clamp-3 font-mono text-xs text-foreground">
                      {authSession.userAgent}
                    </p>
                  </div>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No session metadata available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
