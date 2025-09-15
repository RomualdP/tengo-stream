import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export function useInfiniteScroll({
  hasMore,
  loading,
  onLoadMore,
  threshold = 100,
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  const hasMoreRef = useRef(hasMore);
  const loadingRef = useRef(loading);

  // Update refs to avoid stale closures
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
    hasMoreRef.current = hasMore;
    loadingRef.current = loading;
  });

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingRef.current) return;
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMoreRef.current && !loadingRef.current) {
            onLoadMoreRef.current();
          }
        },
        {
          rootMargin: `${threshold}px`,
        }
      );
      
      if (node) {
        observerRef.current.observe(node);
      }
    },
    [threshold] // Only threshold as dependency
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { lastElementRef };
}
