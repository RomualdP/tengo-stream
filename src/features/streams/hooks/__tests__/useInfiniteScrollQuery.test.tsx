import { renderHook, act } from '@testing-library/react'
import { useInfiniteScrollQuery } from '../useInfiniteScrollQuery'

describe('useInfiniteScrollQuery', () => {
  it('returns a ref callback', () => {
    const { result } = renderHook(() =>
      useInfiniteScrollQuery({ hasNextPage: true, isFetchingNextPage: false, fetchNextPage: () => {}, threshold: 100 })
    )
    expect(typeof result.current.lastElementRef).toBe('function')
  })

  it('does not call fetch when already fetching', () => {
    const spy = vi.fn()
    const { result } = renderHook(() =>
      useInfiniteScrollQuery({ hasNextPage: true, isFetchingNextPage: true, fetchNextPage: spy, threshold: 0 })
    )
    act(() => {
      result.current.lastElementRef(document.createElement('div'))
    })
    expect(spy).not.toHaveBeenCalled()
  })

  it('does not call fetch when hasNextPage is false', () => {
    const spy = vi.fn()
    const { result } = renderHook(() =>
      useInfiniteScrollQuery({ hasNextPage: false, isFetchingNextPage: false, fetchNextPage: spy, threshold: 0 })
    )
    act(() => {
      result.current.lastElementRef(document.createElement('div'))
    })
    expect(spy).not.toHaveBeenCalled()
  })
})


