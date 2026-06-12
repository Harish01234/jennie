import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Download,
  LayoutTemplate,
  Play,
  Presentation,
  Sparkles,
  Wand2,
  Zap,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

const features = [
  {
    icon: Wand2,
    title: 'AI-generated slides',
    description:
      'Paste your notes or describe a topic and Jennie drafts a complete, structured deck in seconds.',
  },
  {
    icon: LayoutTemplate,
    title: 'Ready-made templates',
    description:
      'Kick off from curated templates for pitches, updates, training, and more — then tweak everything.',
  },
  {
    icon: Sparkles,
    title: 'Styles & tones',
    description:
      'Choose a visual style, tone of voice, and layout so each deck matches the moment.',
  },
  {
    icon: Play,
    title: 'Built-in slideshow',
    description:
      'Present full screen with keyboard controls and autoplay — no extra software required.',
  },
  {
    icon: Download,
    title: 'Export to PowerPoint',
    description:
      'Download a polished .pptx file you can refine, share, or present anywhere.',
  },
  {
    icon: Zap,
    title: 'Fast iteration',
    description:
      'Regenerate, edit settings, and fine-tune slides until the story lands.',
  },
] as const

const steps = [
  {
    title: 'Describe your idea',
    description:
      'Add a prompt, paste notes, or start from a template. Set the slide count, style, and tone.',
  },
  {
    title: 'Generate the deck',
    description:
      'Jennie writes the slides and creates supporting visuals in the background.',
  },
  {
    title: 'Present or export',
    description:
      'Run the slideshow live or export to PowerPoint and share with your team.',
  },
] as const

function AboutPage() {
  return (
    <div className="bg-page-glow space-y-20 py-8 md:py-12">
      <section className="mx-auto max-w-3xl space-y-6 text-center">
        <Badge variant="secondary" className="gap-1.5">
          <Sparkles className="size-3" />
          AI presentation builder
        </Badge>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground md:text-5xl md:leading-tight">
          Beautiful presentations,{' '}
          <span className="text-gradient-primary">generated in seconds</span>
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
          Jennie turns your ideas, notes, and outlines into polished slide decks.
          Pick a style, generate, and present — without ever opening a slide
          editor.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 gap-2 rounded-full px-6">
            <Link to="/">
              <Sparkles className="size-5" />
              Start creating
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-full px-6"
          >
            <Link to="/signin">Sign in</Link>
          </Button>
        </div>
      </section>

      <section className="space-y-8" aria-labelledby="features-heading">
        <div className="space-y-2 text-center">
          <h2
            id="features-heading"
            className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
          >
            Everything you need to ship a deck
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Powerful generation with the controls to make it your own.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="h-full transition-colors hover:border-primary/40">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-8" aria-labelledby="how-it-works-heading">
        <div className="space-y-2 text-center">
          <h2
            id="how-it-works-heading"
            className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
          >
            How it works
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            From blank page to finished presentation in three steps.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Card className="h-full">
                <CardHeader>
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <CardTitle className="pt-2">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section className="glass mx-auto max-w-3xl rounded-3xl p-8 text-center md:p-12">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Presentation className="size-6" />
        </div>
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Ready to build your next deck?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Create your first AI-generated presentation now — it only takes a
          minute.
        </p>
        <Button asChild size="lg" className="mt-6 h-12 gap-2 rounded-full px-8">
          <Link to="/">
            <Sparkles className="size-5" />
            Get started
          </Link>
        </Button>
      </section>
    </div>
  )
}
