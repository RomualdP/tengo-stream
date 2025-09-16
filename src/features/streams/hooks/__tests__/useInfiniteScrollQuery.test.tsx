import { renderHook, act } from '@testing-library/react'
import { useInfiniteScrollQuery } from '../useInfiniteScrollQuery'

describe('useInfiniteScrollQuery', () => {
  it('calls fetchNextPage when the observed element intersects', () => {
    const observers: Array<{ cb: IntersectionObserverCallback }> = []
    class LocalMockIntersectionObserver {
      cb: IntersectionObserverCallback
      constructor(cb: IntersectionObserverCallback) {
        this.cb = cb
        observers.push({ cb })
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() { return [] as IntersectionObserverEntry[] }
    }
    ;(globalThis as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
      LocalMockIntersectionObserver as unknown as typeof IntersectionObserver

    const spy = vi.fn()
    const { result } = renderHook(() =>
      useInfiniteScrollQuery({ hasNextPage: true, isFetchingNextPage: false, fetchNextPage: spy, threshold: 0 })
    )
    const node = document.createElement('div')
    act(() => {
      result.current.lastElementRef(node)
    })
    act(() => {
      observers[0].cb([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
    })
    expect(spy).toHaveBeenCalledTimes(1)
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


