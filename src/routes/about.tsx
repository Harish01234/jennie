import { Switch } from '#/components/ui/switch'
import { createFileRoute } from '@tanstack/react-router'
import { ModeToggle } from '#/components/mode-toggle'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>

    <Switch />
    <ModeToggle />
  </div>
}
