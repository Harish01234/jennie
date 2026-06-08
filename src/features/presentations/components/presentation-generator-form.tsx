import { useState } from 'react'
import { LayoutTemplate, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import {
  LAYOUT_OPTIONS,
  SLIDE_STYLES,
  TONE_OPTIONS,
  type SlideLayout,
  type SlideStyle,
  type SlideTone,
} from '@/features/presentations/constant/presentation-options'
import {
  PRESENTATION_TEMPLATES,
  type PresentationTemplate,
} from '@/features/presentations/constant/presentation-templates'

const MIN_CONTENT_LENGTH = 20
const MAX_CONTENT_LENGTH = 8000

type HomeFormState = {
  content: string
  slideCount: number
  style: SlideStyle
  tone: SlideTone
  layout: SlideLayout
}

const INITIAL_FORM: HomeFormState = {
  content: '',
  slideCount: 8,
  style: 'minimal',
  tone: 'formal',
  layout: 'balanced',
}

const selectTriggerClass =
  'h-11 w-full rounded-xl border-border/60 bg-background/40 shadow-none transition-colors hover:bg-background/60'

export function PresentationGeneratorForm() {
  const [form, setForm] = useState<HomeFormState>(INITIAL_FORM)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  )
  const [isGenerating, setIsGenerating] = useState(false)

  const applyTemplate = (template: PresentationTemplate) => {
    setSelectedTemplateId(template.id)
    setForm({
      content: template.content,
      slideCount: template.slides,
      style: template.style,
      tone: template.tone,
      layout: template.layout,
    })
    toast.success(`"${template.label}" template applied`)
  }

  const handleGenerate = async () => {
    const trimmed = form.content.trim()

    if (trimmed.length < MIN_CONTENT_LENGTH) {
      toast.error('Add more content', {
        description: `Please enter at least ${MIN_CONTENT_LENGTH} characters to generate a presentation.`,
      })
      return
    }

    if (trimmed.length > MAX_CONTENT_LENGTH) {
      toast.error('Content too long', {
        description: `Maximum ${MAX_CONTENT_LENGTH.toLocaleString()} characters allowed.`,
      })
      return
    }

    setIsGenerating(true)

    try {
      // TODO: wire to presentation generation API
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success('Ready to generate', {
        description: `${form.slideCount} slides · ${form.style} · ${form.tone}`,
      })
    } catch {
      toast.error('Generation failed', {
        description: 'Something went wrong. Please try again.',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-page-glow mx-auto w-full max-w-4xl space-y-12 pb-16">
      {/* Hero */}
      <header className="space-y-3 text-center">
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground md:text-5xl md:leading-tight">
          What do you want to{' '}
          <span className="text-gradient-primary">create?</span>
        </h1>
        <p className="mx-auto max-w-lg text-base text-muted-foreground md:text-lg">
          Enter your content and we&apos;ll generate a beautiful presentation
        </p>
      </header>

      {/* Main generator card */}
      <section
        className="glass rounded-3xl p-6 md:p-8"
        aria-label="Presentation generator"
      >
        <div className="space-y-6">
          {/* Content input */}
          <div className="space-y-2">
            <Textarea
              id="presentation-content"
              placeholder="Describe your presentation topic, paste your notes, or outline your key points..."
              value={form.content}
              onChange={(e) => {
                setSelectedTemplateId(null)
                setForm((s) => ({ ...s, content: e.target.value }))
              }}
              maxLength={MAX_CONTENT_LENGTH}
              className="min-h-[220px] resize-none rounded-2xl border-border/50 bg-background/30 text-base leading-relaxed shadow-none focus-visible:border-primary/40 focus-visible:ring-primary/20"
              aria-describedby="content-meta"
            />
            <div
              id="content-meta"
              className="flex justify-between px-1 text-xs text-muted-foreground"
            >
              <span>
                {form.content.length.toLocaleString()} characters
                {form.content.length > 0 &&
                  form.content.length < MIN_CONTENT_LENGTH && (
                    <span className="text-destructive">
                      {' '}
                      · min {MIN_CONTENT_LENGTH}
                    </span>
                  )}
              </span>
              <span>Markdown supported</span>
            </div>
          </div>

          {/* Options row */}
          <div className="grid grid-cols-1 gap-5 border-t border-border/50 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <Label
                htmlFor="slide-count"
                className="text-sm font-medium text-foreground"
              >
                Slides: {form.slideCount}
              </Label>
              <Slider
                id="slide-count"
                value={[form.slideCount]}
                onValueChange={([v]) =>
                  setForm((s) => ({ ...s, slideCount: v }))
                }
                min={3}
                max={20}
                step={1}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Style
              </Label>
              <Select
                value={form.style}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    style: value as SlideStyle,
                  }))
                }
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass">
                  {SLIDE_STYLES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Tone
              </Label>
              <Select
                value={form.tone}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    tone: value as SlideTone,
                  }))
                }
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass">
                  {TONE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Layout
              </Label>
              <Select
                value={form.layout}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    layout: value as SlideLayout,
                  }))
                }
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass">
                  {LAYOUT_OPTIONS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate CTA */}
          <div className="flex justify-end border-t border-border/50 pt-6">
            <Button
              type="button"
              size="lg"
              disabled={isGenerating || form.content.trim().length === 0}
              onClick={() => void handleGenerate()}
              className="h-12 gap-2 rounded-full px-8 text-base shadow-lg shadow-primary/20"
            >
              <Sparkles className="size-5" />
              {isGenerating ? 'Generating…' : 'Generate PPT'}
            </Button>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="space-y-5" aria-label="Presentation templates">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="size-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Start from a template
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRESENTATION_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => applyTemplate(template)}
              className={cn(
                'glass group rounded-2xl p-4 text-left transition-all hover:scale-[1.01] hover:border-primary/30',
                selectedTemplateId === template.id &&
                  'border-primary/40 ring-2 ring-primary/50',
              )}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className="font-medium text-foreground group-hover:text-primary">
                  {template.label}
                </span>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {template.slides} slides
                </span>
              </div>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {template.content.split('\n')[0]}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
