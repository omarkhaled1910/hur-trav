import { toKebabCase } from '@/utilities/toKebabCase'

type SurgeryLike = {
  id?: string | null
  slug?: string | null
  title?: string | null
}

/** URL segment for a nested surgery — prefers stored slug, then title, then id. */
export function getSurgerySlug(surgery: SurgeryLike): string {
  const fromSlug = surgery.slug?.trim()
  if (fromSlug) return fromSlug

  const fromTitle = surgery.title?.trim()
  if (fromTitle) {
    const kebab = toKebabCase(fromTitle)
      .replace(/[^\p{L}\p{N}-]+/gu, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    if (kebab) return kebab
  }

  return surgery.id ?? ''
}

export function findSurgeryBySlug<T extends SurgeryLike>(
  surgeries: T[] | null | undefined,
  surgerySlug: string,
): T | undefined {
  if (!surgeries?.length || !surgerySlug) return undefined

  const decoded = decodeURIComponent(surgerySlug)
  return surgeries.find((surgery) => {
    if (surgery.slug === decoded || surgery.slug === surgerySlug) return true
    if (surgery.id === decoded || surgery.id === surgerySlug) return true
    return getSurgerySlug(surgery) === decoded || getSurgerySlug(surgery) === surgerySlug
  })
}
