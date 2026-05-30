'use client'

import { useInfiniteQuery } from '@tanstack/react-query'

interface SearchParams {
  query: string
  sort?: string
  limit?: number
}

interface SearchResponse {
  docs: Array<{
    id: string | number
    title: string
    slug: string
    meta?: Record<string, unknown>
    publishedAt: string
  }>
  totalDocs: number
  hasNextPage: boolean
  nextPage: number | null
}

async function fetchSearchResults(
  params: SearchParams & { page: number },
): Promise<SearchResponse> {
  const { query, sort, page, limit = 12 } = params

  const searchParams = new URLSearchParams()
  if (query) searchParams.set('q', query)
  if (sort) searchParams.set('sort', sort)
  searchParams.set('page', String(page))
  searchParams.set('limit', String(limit))

  const response = await fetch(`/api/search?${searchParams.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch search results')
  }

  return response.json()
}

export function useSearchInfinite(params: SearchParams) {
  const { query, sort, limit = 12 } = params

  return useInfiniteQuery({
    queryKey: ['search', { query, sort, limit }],
    queryFn: ({ pageParam = 1 }) =>
      fetchSearchResults({ query, sort, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: SearchResponse) => {
      if (lastPage.hasNextPage && lastPage.nextPage) {
        return lastPage.nextPage
      }
      return undefined
    },
    refetchOnWindowFocus: false,
  })
}
