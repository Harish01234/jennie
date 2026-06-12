import { FileText } from 'lucide-react'

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty'
import { Skeleton } from '#/components/ui/skeleton'

import type { Presentation } from '../types/presentation.types'

import { PresentationCard } from './presentation-card'

type PresentationListSectionProps = {
  presentations: Presentation[]
  isPending: boolean
}

function PresentationCardSkeleton() {
  return (
    <div className="glass flex gap-4 rounded-xl border border-border/50 p-4">
      <Skeleton className="size-[72px] shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2 py-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/5" />
      </div>
    </div>
  )
}

export function PresentationListSection({
  presentations,
  isPending,
}: PresentationListSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-foreground">
          Your presentations
        </h2>
        {!isPending && presentations.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {presentations.length}{' '}
            {presentations.length === 1 ? 'deck' : 'decks'}
          </span>
        )}
      </div>

      {isPending ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <li key={i}>
              <PresentationCardSkeleton />
            </li>
          ))}
        </ul>
      ) : presentations.length === 0 ? (
        <Empty className="glass rounded-2xl py-10">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>No presentations yet</EmptyTitle>
            <EmptyDescription>
              Create your first deck with the form below.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {presentations.map((p) => (
            <li key={p.id}>
              <PresentationCard presentation={p} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
