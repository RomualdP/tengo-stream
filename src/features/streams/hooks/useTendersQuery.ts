import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { TenderApiService } from '../services/tenderApi';
import type { Tender, DecisionStatus } from '../types';

interface TenderSearchResponse {
  results: Tender[];
  totalCount: number;
}

interface UseTendersQueryReturn {
  tenders: Tender[];
  loading: boolean;
  error: string | null;
  remainingCount: number;
  totalCount: number;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  recordDecision: (tenderId: number, decisionStatus: DecisionStatus) => Promise<void>;
  refresh: () => void;
}

export function useTendersQuery(): UseTendersQueryReturn {
  const queryClient = useQueryClient();

  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<TenderSearchResponse>({
    queryKey: ['tenders'],
    queryFn: async ({ pageParam = 0 }) => {
      return await TenderApiService.searchTenders(pageParam as number, 10);
    },
    getNextPageParam: (lastPage, allPages) => {
      // Calculate how many items we've actually loaded from the server
      const serverLoadedCount = allPages.length * 10; // Each page loads 10 items from server
      const totalAvailable = lastPage.totalCount;
      
      // There are more pages if we haven't loaded everything from the server yet
      const hasMore = serverLoadedCount < totalAvailable;
      
      return hasMore ? serverLoadedCount : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Auto-load more data when we have few tenders left
  useEffect(() => {
    if (!data) return;
    
    const totalVisibleTenders = data.pages.reduce((total, page) => total + page.results.length, 0);
    
    // If we have less than 5 tenders visible and there are more pages available, load more
    if (totalVisibleTenders <= 5 && hasNextPage && !isFetchingNextPage) {
      const timer = setTimeout(() => {
        fetchNextPage();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [data, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const recordDecisionMutation = useMutation({
    mutationFn: async ({ tenderId, decisionStatus }: { tenderId: number; decisionStatus: DecisionStatus }) => {
      return await TenderApiService.recordDecision(tenderId, decisionStatus);
    },
    onSuccess: (_, { tenderId, decisionStatus }) => {
      // Optimistically update the cache
      queryClient.setQueryData(['tenders'], (oldData: unknown) => {
        if (!oldData || typeof oldData !== 'object') return oldData;
        
        const data = oldData as { pages: TenderSearchResponse[] };
        return {
          ...data,
          pages: data.pages.map((page: TenderSearchResponse) => ({
            ...page,
            results: page.results.filter((tender: Tender) => tender.id !== tenderId),
          })),
        };
      });

      // Check if we need to load more data immediately after mutation
      const currentData = queryClient.getQueryData(['tenders']) as { pages: TenderSearchResponse[] } | undefined;
      if (currentData) {
        const totalVisibleTenders = currentData.pages.reduce((total, page) => total + page.results.length, 0);
        
        if (totalVisibleTenders <= 5 && hasNextPage && !isFetchingNextPage) {
          setTimeout(() => {
            fetchNextPage();
          }, 300);
        }
      }

      // Update total counts
      queryClient.setQueryData(['tenders'], (oldData: unknown) => {
        if (!oldData || typeof oldData !== 'object') return oldData;
        
        const data = oldData as { pages: TenderSearchResponse[] };
        return {
          ...data,
          pages: data.pages.map((page: TenderSearchResponse, index: number) => {
            if (index === 0) {
              return {
                ...page,
                totalCount: Math.max(0, page.totalCount - 1),
              };
            }
            return page;
          }),
        };
      });

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
    },
    onError: () => {
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
    },
  });

  const recordDecision = async (tenderId: number, decisionStatus: DecisionStatus) => {
    await recordDecisionMutation.mutateAsync({ tenderId, decisionStatus });
  };

  const refresh = () => {
    refetch();
    toast.success('Flux actualisé', {
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
  };

  // Flatten all pages into a single array
  const tenders = data?.pages.flatMap(page => page.results) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  return {
    tenders,
    loading: isLoading,
    error: error?.message ?? null,
    remainingCount: totalCount, // Show total count, not remaining
    totalCount,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
    recordDecision,
    refresh,
  };
}
