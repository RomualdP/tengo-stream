import { Container, Title, Group, Stack, Alert, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { TenderList } from './TenderList';
import { StreamCounter } from './StreamCounter';
import { useTendersQuery } from '../hooks/useTendersQuery';
import { useInfiniteScrollQuery } from '../hooks/useInfiniteScrollQuery';
import { useStreamDecisionHandlers } from '../hooks/useStreamDecisionHandlers';

interface StreamsPageProps {
  onNavigateToDetail: (tenderId: number, returnTo?: 'streams' | 'pipeline') => void;
}

export function StreamsPage({ onNavigateToDetail }: StreamsPageProps) {

  const {
    tenders,
    loading,
    error,
    remainingCount,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    recordDecision,
    refresh,
  } = useTendersQuery();

  const { lastElementRef } = useInfiniteScrollQuery({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const { handleReject, handleAnalyze } = useStreamDecisionHandlers({ recordDecision });

  const handleViewDetails = (tenderId: number) => {
    onNavigateToDetail(tenderId, 'streams');
  };

  return (
    <Container size="lg" py="md" maw={1200} mx="auto">
      <Stack gap="md">
        {/* Stream title and counter */}
        <Group justify="space-between">
          <Title order={2}>Formation Paris</Title>
          <Group gap="sm">
            <StreamCounter remainingCount={remainingCount} />
            <Button
              variant="outline"
              size="xs"
              leftSection={<IconRefresh size={14} />}
              onClick={refresh}
              loading={loading}
            >
              Refresh
            </Button>
          </Group>
        </Group>

        {/* Error state */}
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Loading Error"
            color="red"
            variant="light"
          >
            {error}
          </Alert>
        )}

        {/* Tender list */}
        <TenderList
          tenders={tenders}
          loading={loading || isFetchingNextPage}
          hasMore={hasNextPage}
          onReject={handleReject}
          onAnalyze={handleAnalyze}
          onViewDetails={handleViewDetails}
        />

        {/* Infinite scroll trigger */}
        <div ref={lastElementRef} />
      </Stack>
    </Container>
  );
}
