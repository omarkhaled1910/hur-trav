import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const sort = searchParams.get('sort') || 'relevance'
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 12

    const payload = await getPayload({ config: configPromise })

    let sortOption: string | undefined = undefined
    if (sort === 'newest') {
      sortOption = '-publishedAt'
    } else if (sort === 'oldest') {
      sortOption = 'publishedAt'
    }

    let posts
    let totalDocs = 0
    let hasNextPage = false
    let nextPage = null

    if (query) {
      const allPosts = await payload.find({
        collection: 'search',
        depth: 1,
        pagination: false,
        limit: 2000,
        ...(sortOption ? { sort: sortOption } : {}),
      })

      const lowerQuery = query.toLowerCase()
      const filteredDocs = allPosts.docs.filter((doc: { title?: string | null; slug?: string | null; meta?: { title?: string | null; description?: string | null } }) => {
        if (doc.title?.toLowerCase().includes(lowerQuery)) return true
        if (doc.meta?.title?.toLowerCase().includes(lowerQuery)) return true
        if (doc.meta?.description?.toLowerCase().includes(lowerQuery)) return true
        if (doc.slug?.toLowerCase().includes(lowerQuery)) return true
        return false
      })

      totalDocs = filteredDocs.length
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedDocs = filteredDocs.slice(startIndex, endIndex)

      hasNextPage = endIndex < filteredDocs.length
      nextPage = hasNextPage ? page + 1 : null

      posts = { docs: paginatedDocs }
    } else {
      posts = await payload.find({
        collection: 'search',
        depth: 1,
        limit,
        page,
        ...(sortOption ? { sort: sortOption } : {}),
      })

      totalDocs = posts.totalDocs
      hasNextPage = posts.hasNextPage
      nextPage = posts.nextPage
    }

    return NextResponse.json({
      docs: posts.docs,
      totalDocs,
      hasNextPage,
      nextPage,
    })
  } catch (error) {
    console.error('Error searching:', error)
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 })
  }
}
