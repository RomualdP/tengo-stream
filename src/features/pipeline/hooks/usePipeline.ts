import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { TenderApiService } from '../../streams/services/tenderApi';
import type { Tender } from '../../streams/types';

interface UsePipelineReturn {
  tenders: Tender[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  refresh: () => Promise<void>;
}

export function usePipeline(): UsePipelineReturn {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const loadPipelineTenders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all tenders marked as TO_ANALYZE
      const response = await TenderApiService.getPipelineTenders();
      
      setTenders(response.results);
      setTotalCount(response.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      await loadPipelineTenders();
      toast.success('Pipeline actualisé', {
        icon: '✓',
        style: {
          background: '#ffffff',
          color: '#333333',
          border: '1px solid #e5e7eb',
        },
        iconTheme: {
          primary: '#10b981',
          secondary: '#ffffff',
        },
      });
    } catch (err) {
      console.error('Pipeline refresh error:', err);
      toast.error('Erreur lors de l\'actualisation du pipeline', {
        icon: '✕',
        style: {
          background: '#ffffff',
          color: '#333333',
          border: '1px solid #e5e7eb',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#ffffff',
        },
      });
    }
  }, [loadPipelineTenders]);

  useEffect(() => {
    loadPipelineTenders();
  }, [loadPipelineTenders]);

  return {
    tenders,
    loading,
    error,
    totalCount,
    refresh,
  };
}
