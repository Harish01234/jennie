import { Link } from '@tanstack/react-router'
import { Hexagon } from 'lucide-react'

import { ModeToggle } from '@/components/mode-toggle'
import { NavbarUserMenu } from '@/components/navbar-user-menu'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
] as const

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl min-w-0 items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Hexagon className="size-5" />
          </span>
          <span className="text-lg tracking-tight">Jennie</span>
        </Link>

        <NavigationMenu className="min-w-0 flex-1 justify-center">
          <NavigationMenuList className="gap-1">
            {navLinks.map(({ to, label }) => (
              <NavigationMenuItem key={to}>
                <NavigationMenuLink
                  asChild
                  className="px-3 py-2 font-medium text-muted-foreground data-[status=active]:bg-muted/50 data-[status=active]:text-foreground"
                >
                  <Link to={to} activeOptions={{ exact: to === '/' }}>
                    {label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex shrink-0 items-center gap-2">
          <NavbarUserMenu />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
