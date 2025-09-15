import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { TenderApiService } from '../services/tenderApi';
import type { Tender, DecisionStatus } from '../types';

interface TenderDetails extends Tender {
  decisionStatus: DecisionStatus | null;
  processed: boolean;
}

interface UseTenderDetailsReturn {
  tender: TenderDetails | null;
  loading: boolean;
  error: string | null;
  recordDecision: (tenderId: number, decisionStatus: DecisionStatus) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useTenderDetails(tenderId: number): UseTenderDetailsReturn {
  const [tender, setTender] = useState<TenderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTenderDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const tenderDetails = await TenderApiService.getTenderById(tenderId);
      setTender(tenderDetails);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [tenderId]);

  const recordDecision = useCallback(async (tenderId: number, decisionStatus: DecisionStatus) => {
    try {
      await TenderApiService.recordDecision(tenderId, decisionStatus);

      // Update the tender state to reflect the decision
      setTender(prev => prev ? {
        ...prev,
        decisionStatus,
        processed: true
      } : null);

      // Show success notification
      if (decisionStatus === 'TO_ANALYZE') {
        toast.success('Marché ajouté au pipeline', {
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
      } else {
        toast.success('Marché rejeté', {
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

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to record decision';
      setError(errorMessage);
      toast.error('La décision n\'a pas pu être enregistrée', {
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
  }, []);

  const refresh = useCallback(async () => {
    try {
      await loadTenderDetails();
      toast.success('Détails actualisés', {
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
      console.error('Refresh error:', err);
      toast.error('Erreur lors de l\'actualisation', {
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
  }, [loadTenderDetails]);

  useEffect(() => {
    loadTenderDetails();
  }, [loadTenderDetails]);

  return {
    tender,
    loading,
    error,
    recordDecision,
    refresh,
  };
}
