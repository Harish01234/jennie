/** Attribution metadata for a Wikimedia Commons image suitable for PPT use. */
export type FreePptImageResult = {
  /** Direct HTTPS URL to the image file (suitable for embedding in slides). */
  imageUrl: string
  /** Wikimedia file title, e.g. "File:Example.jpg". */
  title: string
  /** Fixed source identifier for attribution. */
  sourceName: 'Wikimedia Commons'
  /** Short license name, e.g. "CC BY-SA 4.0". */
  license: string
  /** Creator / artist when available. */
  artist: string
  /** Combined credit line when provided by Wikimedia metadata. */
  credit: string
  /** Canonical Commons page URL for the file. */
  sourcePageUrl: string
  width: number
  height: number
}
