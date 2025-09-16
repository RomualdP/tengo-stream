import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, act, waitFor } from '@testing-library/react'
import { vi, type Mock } from 'vitest'
import { useTendersQuery } from '../useTendersQuery'
import { TenderApiService } from '../../services/tenderApi'
import type { DecisionStatus } from '../../types'

vi.mock('../../services/tenderApi', () => ({
  TenderApiService: {
    searchTenders: vi.fn(),
    recordDecision: vi.fn(),
  },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useTendersQuery', () => {
  it('loads first page and exposes data', async () => {
    (TenderApiService.searchTenders as unknown as Mock).mockResolvedValueOnce({
      results: Array.from({ length: 10 }).map((_, i) => ({ id: i + 1 })),
      totalCount: 25,
    })

    const { result } = renderHook(() => useTendersQuery(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.tenders.length).toBe(10)
    expect(result.current.hasNextPage).toBe(true)
  })

  it('fetches next page when fetchNextPage is called', async () => {
    (TenderApiService.searchTenders as unknown as Mock)
      .mockResolvedValueOnce({
        results: Array.from({ length: 10 }).map((_, i) => ({ id: i + 1 })),
        totalCount: 25,
      })
      .mockResolvedValueOnce({
        results: Array.from({ length: 10 }).map((_, i) => ({ id: 11 + i })),
        totalCount: 25,
      })

    const { result } = renderHook(() => useTendersQuery(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.fetchNextPage()
    })

    await waitFor(() => expect(result.current.tenders.length).toBe(20))
  })

  it('invalidates and refetches after decision', async () => {
    (TenderApiService.searchTenders as unknown as Mock)
      .mockResolvedValueOnce({
        results: Array.from({ length: 10 }).map((_, i) => ({ id: i + 1 })),
        totalCount: 25,
      })
      .mockResolvedValueOnce({
        results: Array.from({ length: 10 }).map((_, i) => ({ id: 100 + i })),
        totalCount: 24,
      })
    ;(TenderApiService.recordDecision as unknown as Mock).mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useTendersQuery(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.loading).toBe(false))
    
    await act(async () => {
      const status: DecisionStatus = 'REJECTED'
      await result.current.recordDecision(1, status)
    })

    await waitFor(() => expect(result.current.tenders[0]?.id).toBe(100))
  })

  it('sets hasNextPage=false when last page size < 10', async () => {
    (TenderApiService.searchTenders as unknown as Mock).mockResolvedValueOnce({
      results: Array.from({ length: 7 }).map((_, i) => ({ id: i + 1 })),
      totalCount: 7,
    })

    const { result } = renderHook(() => useTendersQuery(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.hasNextPage).toBe(false)
    expect(result.current.tenders.length).toBe(7)
  })

  it('propagates error message when API fails', async () => {
    (TenderApiService.searchTenders as unknown as Mock).mockRejectedValueOnce(new Error('boom'))

    const { result } = renderHook(() => useTendersQuery(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('boom')
  })
})


