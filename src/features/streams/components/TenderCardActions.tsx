import { Group, Button } from '@mantine/core';
import { useCallback, useState } from 'react';
import { useStreamDecisionHandlers } from '../hooks/useStreamDecisionHandlers';
import { useTendersQuery } from '../hooks/useTendersQuery';

interface TenderCardActionsProps {
  tenderId: number;
}

export function TenderCardActions({ tenderId }: TenderCardActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { recordDecision } = useTendersQuery();
  const { handleReject, handleAnalyze } = useStreamDecisionHandlers({ recordDecision });

  const handle = useCallback(async (fn?: (id: number) => Promise<void> | void) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await fn?.(tenderId);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, tenderId]);

  return (
    <Group gap="xs">
      <Button
        variant="outline"
        color="red"
        size="xs"
        onClick={() => handle(handleReject)}
        disabled={isProcessing}
        loading={isProcessing}
      >
        X Rejeter
      </Button>
      <Button
        variant="filled"
        color="blue"
        size="xs"
        onClick={() => handle(handleAnalyze)}
        disabled={isProcessing}
        loading={isProcessing}
     >
        ✓ À analyser
      </Button>
    </Group>
  );
}


