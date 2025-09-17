import { useCallback } from 'react';
import type { DecisionStatus } from '../types';

interface UseStreamDecisionHandlersParams {
  recordDecision: (tenderId: number, decisionStatus: DecisionStatus) => Promise<void>;
}

interface UseStreamDecisionHandlersReturn {
  handleReject: (tenderId: number) => Promise<void>;
  handleAnalyze: (tenderId: number) => Promise<void>;
}

export function useStreamDecisionHandlers({ recordDecision }: UseStreamDecisionHandlersParams): UseStreamDecisionHandlersReturn {
  const handleReject = useCallback(async (tenderId: number) => {
    await recordDecision(tenderId, 'REJECTED');
  }, [recordDecision]);

  const handleAnalyze = useCallback(async (tenderId: number) => {
    await recordDecision(tenderId, 'TO_ANALYZE');
  }, [recordDecision]);

  return { handleReject, handleAnalyze };
}


