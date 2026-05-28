import type { Access } from 'payload'

/** Public reads only published documents; authenticated users see all. */
export const publishedOnly: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    published: { equals: true },
  }
}
