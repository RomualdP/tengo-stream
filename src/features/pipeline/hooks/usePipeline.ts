import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
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
      notifications.show({
        title: 'Succès',
        message: 'Pipeline actualisé',
        color: 'teal',
        icon: React.createElement(IconCheck, { size: 20 }),
        autoClose: 3000,
      });
    } catch (err) {
      console.error('Pipeline refresh error:', err);
      notifications.show({
        title: 'Erreur',
        message: 'Erreur lors de l\'actualisation du pipeline',
        color: 'red',
        icon: React.createElement(IconX, { size: 20 }),
        autoClose: 4000,
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
