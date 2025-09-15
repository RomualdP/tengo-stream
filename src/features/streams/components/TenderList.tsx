import { Stack, Loader, Text, Box } from '@mantine/core';
import { TenderCard } from './TenderCard';
import type { Tender } from '../types';

interface TenderListProps {
  tenders: Tender[];
  loading?: boolean;
  hasMore?: boolean;
  onReject?: (tenderId: number) => void;
  onAnalyze?: (tenderId: number) => void;
  onLoadMore?: () => void;
}

export function TenderList({ 
  tenders, 
  loading = false, 
  hasMore = false, 
  onReject, 
  onAnalyze
}: TenderListProps) {
  return (
    <Stack gap="md">
      {tenders.map((tender) => (
        <TenderCard
          key={tender.id}
          tender={tender}
          onReject={onReject}
          onAnalyze={onAnalyze}
        />
      ))}
      
      {/* Loading indicator for infinite scroll */}
      {loading && (
        <Box ta="center" py="md">
          <Loader size="sm" />
          <Text size="sm" c="dimmed" mt="xs">
            Loading tenders...
          </Text>
        </Box>
      )}
      
      {/* End of list indicator */}
      {!hasMore && tenders.length > 0 && (
        <Box ta="center" py="md">
          <Text size="sm" c="dimmed">
            All tenders have been loaded
          </Text>
        </Box>
      )}
      
      {/* Empty state */}
      {tenders.length === 0 && !loading && (
        <Box ta="center" py="xl">
          <Text size="lg" c="dimmed">
            No tenders available
          </Text>
        </Box>
      )}
    </Stack>
  );
}
