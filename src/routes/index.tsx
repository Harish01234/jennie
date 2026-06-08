import { createFileRoute } from '@tanstack/react-router'

import { PresentationGeneratorForm } from '@/features/presentations/components/presentation-generator-form'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="bg-page-glow min-h-screen py-16">
      <PresentationGeneratorForm />
    </div>
  )
  
}
