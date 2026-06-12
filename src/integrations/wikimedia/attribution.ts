import type { FreePptImageResult } from './types'

/** Prefix used when appending image attribution to slide speaker notes. */
export const IMAGE_ATTRIBUTION_PREFIX = '[Image attribution] '

/** Human-readable attribution line stored in slide notes for PPT compliance. */
export function formatImageAttributionNote(image: FreePptImageResult): string {
  const byline = image.credit || image.artist || image.title
  return `${IMAGE_ATTRIBUTION_PREFIX}${byline}. License: ${image.license}. Source: ${image.sourceName} (${image.sourcePageUrl})`
}

/** Extract attribution line from slide notes, if present. */
export function parseImageAttributionFromNotes(
  notes: string | null | undefined,
): string | null {
  if (!notes) return null
  const line = notes
    .split('\n')
    .find((l) => l.startsWith(IMAGE_ATTRIBUTION_PREFIX))
  return line ? line.slice(IMAGE_ATTRIBUTION_PREFIX.length) : null
}
