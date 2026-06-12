import { createFileRoute } from '@tanstack/react-router'

import { PresentationGeneratorForm } from '@/features/presentations/components/presentation-generator-form'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="py-8 md:py-12">
      <PresentationGeneratorForm />
    </div>
  )
}
