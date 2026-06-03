import { SignInForm } from '#/components/auth/signin-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/signin')({
  component: RouteComponent,
})

function RouteComponent() {
  return  <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
  <SignInForm />
</div>
}
