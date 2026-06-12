import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Hexagon, Menu } from 'lucide-react'

import { ModeToggle } from '@/components/mode-toggle'
import { NavbarUserMenu } from '@/components/navbar-user-menu'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/me', label: 'Me' },
  { to: '/about', label: 'About' },
] as const

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="glass sticky top-0 z-50 w-full">
      <div className="mx-auto flex h-16 max-w-6xl min-w-0 items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Hexagon className="size-5" />
          </span>
          <span className="text-lg tracking-tight">Jennie</span>
        </Link>

        <NavigationMenu className="hidden min-w-0 flex-1 justify-center md:flex">
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

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Hexagon className="size-4" />
                  </span>
                  Jennie
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-2">
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    activeOptions={{ exact: to === '/' }}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:bg-muted/60 data-[status=active]:text-foreground"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
