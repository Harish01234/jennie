import type { FreePptImageResult } from './types'

const COMMONS_API = 'https://commons.wikimedia.org/w/api.php'
const COMMONS_WIKI_BASE = 'https://commons.wikimedia.org/wiki/'

const USER_AGENT = 'Jennie/1.0 (AI presentation generator; Wikimedia Commons image search)'

const ALLOWED_MIME_PREFIXES = ['image/jpeg', 'image/png', 'image/webp'] as const
const EXCLUDED_FILE_EXTENSIONS = [
  '.pdf',
  '.djvu',
  '.svg',
  '.webm',
  '.ogv',
  '.ogg',
  '.mp3',
  '.mp4',
] as const
const MIN_WIDTH = 640
const MIN_LANDSCAPE_RATIO = 1.15

type WikimediaSearchResponse = {
  query?: {
    search?: Array<{ title: string; size?: number }>
  }
}

type WikimediaImageInfoResponse = {
  query?: {
    pages?: Record<
      string,
      {
        title?: string
        missing?: boolean
        imageinfo?: Array<{
          url?: string
          width?: number
          height?: number
          mime?: string
          extmetadata?: Record<string, { value?: string } | undefined>
        }>
      }
    >
  }
}

/** Strip HTML and decode common entities from Wikimedia extmetadata values. */
function stripMetadataHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Shorten and sanitize a free-text query for Wikimedia File search. */
export function cleanPptImageQuery(query: string): string {
  return query
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 8)
    .join(' ')
    .slice(0, 80)
}

function isExcludedFileTitle(title: string): boolean {
  const lower = title.toLowerCase()
  return EXCLUDED_FILE_EXTENSIONS.some((ext) => lower.endsWith(ext))
}

function isAllowedImageMime(mime: string | undefined): boolean {
  if (!mime) return false
  return ALLOWED_MIME_PREFIXES.some((prefix) => mime.startsWith(prefix))
}

function landscapeScore(width: number, height: number): number {
  if (height <= 0) return 0
  const ratio = width / height
  if (ratio < MIN_LANDSCAPE_RATIO) return ratio * 0.5
  return ratio
}

type WikimediaPages = NonNullable<
  NonNullable<WikimediaImageInfoResponse['query']>['pages']
>

function pickBestCandidate(pages: WikimediaPages | undefined): FreePptImageResult | null {
  if (!pages) return null

  let best: FreePptImageResult | null = null
  let bestScore = -1

  for (const page of Object.values(pages)) {
    if (page.missing || !page.title || !page.imageinfo?.length) continue
    if (isExcludedFileTitle(page.title)) continue

    const info = page.imageinfo[0]
    const url = info.url
    const width = info.width ?? 0
    const height = info.height ?? 0

    if (!url || !isAllowedImageMime(info.mime)) continue
    if (width < MIN_WIDTH) continue

    const meta = info.extmetadata ?? {}
    const artist = stripMetadataHtml(meta.Artist?.value ?? '')
    const credit = stripMetadataHtml(meta.Credit?.value ?? '')
    const license = stripMetadataHtml(
      meta.LicenseShortName?.value ??
        meta.UsageTerms?.value ??
        'See Wikimedia Commons',
    )

    const score =
      landscapeScore(width, height) * 1000 +
      Math.min(width, 2560) +
      (credit || artist ? 50 : 0)

    if (score <= bestScore) continue

    bestScore = score
    best = {
      imageUrl: url,
      title: page.title,
      sourceName: 'Wikimedia Commons',
      license: license || 'See source page',
      artist: artist || 'Unknown',
      credit: credit || artist || page.title,
      sourcePageUrl: `${COMMONS_WIKI_BASE}${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
      width,
      height,
    }
  }

  return best
}

async function commonsApiGet<T>(params: Record<string, string>): Promise<T | null> {
  const url = new URL(COMMONS_API)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(15_000),
    })

    if (!response.ok) return null

    const data = (await response.json()) as T
    return data
  } catch {
    return null
  }
}

/**
 * Search Wikimedia Commons (no API key) for a landscape image suitable for PPT slides.
 *
 * @example
 * ```ts
 * const image = await getFreePptImageWithoutKey('corporate office safety training')
 * if (image) {
 *   console.log(image.imageUrl, image.license, image.credit)
 * }
 * ```
 */
export async function getFreePptImageWithoutKey(
  query: string,
): Promise<FreePptImageResult | null> {
  const cleaned = cleanPptImageQuery(query)
  if (!cleaned) return null

  const searchData = await commonsApiGet<WikimediaSearchResponse>({
    action: 'query',
    list: 'search',
    srsearch: `${cleaned} filetype:bitmap`,
    srnamespace: '6',
    srlimit: '15',
    format: 'json',
  })

  const titles = searchData?.query?.search?.map((r) => r.title).filter(Boolean) ?? []
  if (titles.length === 0) return null

  const imageData = await commonsApiGet<WikimediaImageInfoResponse>({
    action: 'query',
    titles: titles.join('|'),
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiextmetadatafilter:
      'Artist|LicenseShortName|Credit|ImageDescription|UsageTerms|Attribution',
    format: 'json',
  })

  return pickBestCandidate(imageData?.query?.pages)
}
