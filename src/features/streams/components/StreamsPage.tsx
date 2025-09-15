import { Container, Title, Group, Stack, Alert, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { useCallback, useState } from 'react';
import { TenderList } from './TenderList';
import { StreamCounter } from './StreamCounter';
import { TenderDetailPage } from './TenderDetailPage';
import { useTenders } from '../hooks/useTenders';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

export function StreamsPage() {
  const [selectedTenderId, setSelectedTenderId] = useState<number | null>(null);

  const {
    tenders,
    loading,
    error,
    remainingCount,
    loadMore,
    recordDecision,
    refresh,
  } = useTenders();

  const { lastElementRef } = useInfiniteScroll({
    hasMore: tenders.length > 0,
    loading,
    onLoadMore: loadMore,
  });

  const handleReject = useCallback(async (tenderId: number) => {
    await recordDecision(tenderId, 'REJECTED');
  }, [recordDecision]);

  const handleAnalyze = useCallback(async (tenderId: number) => {
    await recordDecision(tenderId, 'TO_ANALYZE');
  }, [recordDecision]);

  const handleViewDetails = useCallback((tenderId: number) => {
    setSelectedTenderId(tenderId);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedTenderId(null);
  }, []);

  // Show detail page if a tender is selected
  if (selectedTenderId) {
    return <TenderDetailPage tenderId={selectedTenderId} onBack={handleBackToList} />;
  }

  return (
    <Container size="lg" py="md">
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
          loading={loading}
          hasMore={tenders.length > 0}
          onReject={handleReject}
          onAnalyze={handleAnalyze}
          onViewDetails={handleViewDetails}
          onLoadMore={loadMore}
        />

        {/* Infinite scroll trigger */}
        <div ref={lastElementRef} />
      </Stack>
    </Container>
  );
}
