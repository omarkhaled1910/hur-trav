import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ originalDoc, searchDoc }) => {
  const { slug, title, meta, heroImage, fullName, profileImage, shortBio, specialty } = originalDoc

  const displayTitle = title || fullName || specialty

  const imageId =
    meta?.image?.id ||
    meta?.image ||
    heroImage?.id ||
    heroImage ||
    profileImage?.id ||
    profileImage ||
    undefined

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    slug,
    meta: {
      ...meta,
      title: meta?.title || displayTitle,
      image: imageId,
      description: meta?.description || originalDoc.excerpt || shortBio,
    },
  }

  return modifiedDoc
}
