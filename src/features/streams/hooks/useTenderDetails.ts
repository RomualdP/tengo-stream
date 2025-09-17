import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
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
        notifications.show({
          title: 'Succès',
          message: 'Marché ajouté au pipeline',
          color: 'teal',
          icon: React.createElement(IconCheck, { size: 20 }),
          autoClose: 3000,
        });
      } else {
        notifications.show({
          title: 'Succès',
          message: 'Marché rejeté',
          color: 'red',
          icon: React.createElement(IconX, { size: 20 }),
          autoClose: 3000,
        });
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to record decision';
      setError(errorMessage);
      notifications.show({
        title: 'Erreur',
        message: 'La décision n\'a pas pu être enregistrée',
        color: 'red',
        icon: React.createElement(IconX, { size: 20 }),
        autoClose: 4000,
      });
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      await loadTenderDetails();
      notifications.show({
        title: 'Succès',
        message: 'Détails actualisés',
        color: 'teal',
        icon: React.createElement(IconCheck, { size: 20 }),
        autoClose: 3000,
      });
    } catch (err) {
      console.error('Refresh error:', err);
      notifications.show({
        title: 'Erreur',
        message: 'Erreur lors de l\'actualisation',
        color: 'red',
        icon: React.createElement(IconX, { size: 20 }),
        autoClose: 4000,
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
