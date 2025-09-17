import { useCallback, useState } from 'react';

interface UseStreamSelectionReturn {
  selectedTenderId: number | null;
  handleViewDetails: (tenderId: number) => void;
  handleBackToList: () => void;
}

export function useStreamSelection(): UseStreamSelectionReturn {
  const [selectedTenderId, setSelectedTenderId] = useState<number | null>(null);

  const handleViewDetails = useCallback((tenderId: number) => {
    setSelectedTenderId(tenderId);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedTenderId(null);
  }, []);

  return { selectedTenderId, handleViewDetails, handleBackToList };
}


