import { useState, useCallback } from 'react';
import type { PageParams, NavigationState } from '../types/navigation';

const initialState: NavigationState = {
  currentPage: { type: 'streams' },
  history: []
};

export function useNavigation() {
  const [state, setState] = useState<NavigationState>(initialState);

  const navigateTo = useCallback((page: PageParams) => {
    setState(prevState => ({
      currentPage: page,
      history: [...prevState.history, prevState.currentPage]
    }));
  }, []);

  const navigateBack = useCallback(() => {
    setState(prevState => {
      if (prevState.history.length === 0) {
        return prevState;
      }

      const newHistory = [...prevState.history];
      const previousPage = newHistory.pop()!;

      return {
        currentPage: previousPage,
        history: newHistory
      };
    });
  }, []);

  const navigateToStreams = useCallback(() => {
    navigateTo({ type: 'streams' });
  }, [navigateTo]);

  const navigateToPipeline = useCallback(() => {
    navigateTo({ type: 'pipeline' });
  }, [navigateTo]);

  const navigateToTenderDetail = useCallback((tenderId: number, returnTo?: 'streams' | 'pipeline') => {
    navigateTo({ type: 'tender-detail', tenderId, returnTo });
  }, [navigateTo]);

  const canGoBack = state.history.length > 0;

  return {
    currentPage: state.currentPage,
    navigateTo,
    navigateBack,
    navigateToStreams,
    navigateToPipeline,
    navigateToTenderDetail,
    canGoBack
  };
}
