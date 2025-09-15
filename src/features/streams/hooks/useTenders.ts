import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [hasMore, setHasMore] = useState(true);
  
  // Use refs to avoid dependency issues
  const skipRef = useRef(0);
  const loadingRef = useRef(false);

  const loadTenders = useCallback(async (reset: boolean = false) => {
    // Prevent multiple simultaneous calls
    if (loadingRef.current) return;
    
    try {
      loadingRef.current = true;
      if (reset) {
        setLoading(true);
        skipRef.current = 0;
        setTenders([]);
      }

      const currentSkip = reset ? 0 : skipRef.current;
      const response = await TenderApiService.searchTenders(currentSkip, 10);
      
      if (reset) {
        setTenders(response.results);
        setTotalCount(response.totalCount);
        setRemainingCount(response.totalCount); // Use totalCount as remainingCount
        skipRef.current = response.results.length;
      } else {
        setTenders(prev => [...prev, ...response.results]);
        setRemainingCount(response.totalCount); // Use totalCount as remainingCount
        skipRef.current += response.results.length;
      }
      
      setHasMore(response.results.length === 10);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []); // No dependencies to avoid re-creation

  const loadMore = useCallback(async () => {
    if (!loadingRef.current && hasMore) {
      await loadTenders(false);
    }
  }, [hasMore, loadTenders]);

  const recordDecision = useCallback(async (tenderId: number, decisionStatus: DecisionStatus) => {
    try {
      await TenderApiService.recordDecision(tenderId, decisionStatus);
      
      // Remove the tender from the list and update counts
      setTenders(prev => {
        const updatedTenders = prev.filter(tender => tender.id !== tenderId);
        
        // Auto-load more if we have very few tenders left and more are available
        if (updatedTenders.length <= 3 && hasMore && !loadingRef.current) {
          // Use setTimeout to avoid state update conflicts
          setTimeout(() => {
            if (!loadingRef.current) {
              loadTenders(false);
            }
          }, 100);
        }
        
        return updatedTenders;
      });
      
      setRemainingCount(prev => Math.max(0, prev - 1));
      setTotalCount(prev => Math.max(0, prev - 1));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record decision');
    }
  }, [hasMore, loadTenders]);

  const refresh = useCallback(async () => {
    await loadTenders(true);
  }, [loadTenders]);

  // Initial load only
  useEffect(() => {
    loadTenders(true);
  }, [loadTenders]);

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
