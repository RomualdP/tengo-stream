import '@testing-library/jest-dom'

// Mock IntersectionObserver for jsdom environment
class MockIntersectionObserver {
  callback: IntersectionObserverCallback
  options?: IntersectionObserverInit
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback
    this.options = options
  }
  observe = () => {}
  unobserve = () => {}
  disconnect = () => {}
  takeRecords = () => [] as IntersectionObserverEntry[]
}

;(globalThis as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver

