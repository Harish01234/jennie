import { Output, generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

import {
  formatImageAttributionNote,
  getFreePptImageWithoutKey,
} from '#/integrations/wikimedia'
import { prisma } from '#/lib/db'

import { inngest } from './client'

const IMAGE_FETCH_CONCURRENCY = 3

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < items.length) {
      const current = nextIndex++
      results[current] = await fn(items[current], current)
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  )
  await Promise.all(workers)
  return results
}

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const slideSchema = z.object({
  title: z.string().describe('Slide title'),
  content: z.string().describe('Main content / bullet points for the slide'),
  notes: z.string().optional().describe('Speaker notes'),
  imagePrompt: z
    .string()
    .describe(
      'A concise Wikimedia Commons search query for a relevant photo (concrete nouns, professional context, e.g. "office safety training workplace")',
    ),
})

const slidesResponseSchema = z.object({
  slides: z.array(slideSchema),
})

export const generatePresentation = inngest.createFunction(
  {
    id: 'generate-presentation',
    retries: 2,
    triggers: [{ event: 'presentation/generate' }],
  },
  async ({ event, step }) => {
    const { presentationId } = event.data as { presentationId: string }

    const presentation = await step.run('fetch-presentation', async () => {
      const p = await prisma.presentation.findUnique({
        where: { id: presentationId },
      })
      if (!p) throw new Error('Presentation not found')
      return p
    })

    await step.run('mark-generating', async () => {
      await prisma.presentation.update({
        where: { id: presentationId },
        data: { status: 'GENERATING' },
      })
    })

    const { slides } = await step.run('generate-slides-content', async () => {
      const systemPrompt = `You are an expert presentation designer. Given a user's content/prompt, create a compelling presentation.

Style: ${presentation.style}
Tone: ${presentation.tone}
Layout preference: ${presentation.layout}
Number of slides requested: ${presentation.slideCount}

Guidelines:
- Create exactly ${presentation.slideCount} slides
- First slide should be a title slide
- Last slide should be a summary or call-to-action
- Keep content concise and impactful
- For imagePrompt, write a short Wikimedia Commons photo search phrase with concrete nouns that match the slide topic
`

      const result = await generateText({
        model: google('gemini-2.5-flash'),
        output: Output.object({ schema: slidesResponseSchema }),
        system: systemPrompt,
        prompt: presentation.prompt,
      })

      return result.output
    })

    await step.run('delete-old-slides', async () => {
      await prisma.slide.deleteMany({
        where: { presentationId },
      })
    })

    await step.run('create-slides', async () => {
      const data = await mapWithConcurrency(
        slides,
        IMAGE_FETCH_CONCURRENCY,
        async (s, i) => {
          const image = await getFreePptImageWithoutKey(s.imagePrompt)
          const attributionNote = image
            ? formatImageAttributionNote(image)
            : null
          const notes = [s.notes, attributionNote].filter(Boolean).join('\n\n')

          return {
            presentationId,
            order: i,
            title: s.title,
            content: s.content,
            notes: notes || null,
            imagePrompt: s.imagePrompt,
            imageUrl: image?.imageUrl ?? null,
          }
        },
      )

      await prisma.slide.createMany({ data })
    })

    await step.run('mark-completed', async () => {
      await prisma.presentation.update({
        where: { id: presentationId },
        data: { status: 'COMPLETED' },
      })
    })

    return { success: true, slideCount: slides.length }
  },
)

export const helloWorld = inngest.createFunction(
  {
    id: 'hello-world',
    triggers: [{ event: 'test/hello.world' }],
  },
  async ({ event, step }) => {
    await step.sleep('wait-a-moment', '1s')
    return { message: `Hello ${event.data.email}!` }
  },
)