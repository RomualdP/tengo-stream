import { useState, useEffect, useCallback } from 'react';
import { TenderApiService } from '../services/tenderApi';
import type { Tender, DecisionStatus } from '../types';

interface UseTendersReturn {
  tenders: Tender[];
  loading: boolean;
  error: string | null;
  remainingCount: number;
  totalCount: number;
  loadMore: () => Promise<void>;
  recordDecision: (tenderId: number, decisionStatus: DecisionStatus) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useTenders(): UseTendersReturn {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remainingCount, setRemainingCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadTenders = useCallback(async (reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setSkip(0);
        setTenders([]);
      }

      const currentSkip = reset ? 0 : skip;
      const response = await TenderApiService.searchTenders(currentSkip, 10);
      
      if (reset) {
        setTenders(response.results);
        setTotalCount(response.results.length);
        setRemainingCount(response.results.length);
      } else {
        setTenders(prev => [...prev, ...response.results]);
        setRemainingCount(prev => prev + response.results.length);
      }
      
      setSkip(currentSkip + response.results.length);
      setHasMore(response.results.length === 10);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [skip]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await loadTenders(false);
    }
  }, [loading, hasMore, loadTenders]);

  const recordDecision = useCallback(async (tenderId: number, decisionStatus: DecisionStatus) => {
    try {
      await TenderApiService.recordDecision(tenderId, decisionStatus);
      
      // Remove the tender from the list
      setTenders(prev => prev.filter(tender => tender.id !== tenderId));
      setRemainingCount(prev => Math.max(0, prev - 1));
      
      // If we're running low on tenders, load more
      if (tenders.length <= 5 && hasMore) {
        await loadMore();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record decision');
    }
  }, [tenders.length, hasMore, loadMore]);

  const refresh = useCallback(async () => {
    await loadTenders(true);
  }, [loadTenders]);

  useEffect(() => {
    loadTenders(true);
  }, []);

  return {
    tenders,
    loading,
    error,
    remainingCount,
    totalCount,
    loadMore,
    recordDecision,
    refresh,
  };
}
