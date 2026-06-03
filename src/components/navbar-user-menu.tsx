import { Link, useRouter } from '@tanstack/react-router'
import { LogIn, LogOut } from 'lucide-react'
import { toast } from 'sonner'

import { authClient } from '@/lib/auth-client'
import { AUTH_LOGIN_PATH } from '@/lib/auth-paths'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

export function NavbarUserMenu() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.navigate({ to: AUTH_LOGIN_PATH })
          },
          onError: (ctx) => {
            toast.error(
              ctx.error?.message ?? 'Failed to sign out. Please try again.',
            )
          },
        },
      })
    } catch {
      toast.error('Failed to sign out. Please try again.')
    }
  }

  if (isPending) {
    return <Skeleton className="size-9 rounded-full" />
  }

  if (!session?.user) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link to={AUTH_LOGIN_PATH}>
          <LogIn />
          Sign in
        </Link>
      </Button>
    )
  }

  const { user } = session
  const initials = getUserInitials(user.name, user.email)
  const displayName = user.name ?? user.email ?? 'Account'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Open account menu"
        >
          <Avatar size="default">
            {user.image ? (
              <AvatarImage src={user.image} alt={displayName} />
            ) : null}
            <AvatarFallback className="bg-primary/10 font-medium text-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <span className="truncate font-medium text-foreground">
              {displayName}
            </span>
            {user.email ? (
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            ) : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="!text-destructive focus:!text-destructive data-highlighted:!text-destructive [&_svg]:!text-destructive"
          onClick={() => void handleSignOut()}
        >
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
