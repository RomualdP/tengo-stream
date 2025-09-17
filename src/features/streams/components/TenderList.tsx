import { Stack, Loader, Text, Box } from '@mantine/core';
import { TenderCard } from './TenderCard';
import { TenderCardActions } from './TenderCardActions';
import type { Tender } from '../types';

interface TenderListProps {
  tenders: Tender[];
  loading?: boolean;
  hasMore?: boolean;
  onReject?: (tenderId: number) => void;
  onAnalyze?: (tenderId: number) => void;
  onViewDetails?: (tenderId: number) => void;
  renderActions?: (tender: Tender) => React.ReactNode;
}

export function TenderList({ 
  tenders, 
  loading = false, 
  hasMore = false, 
  onReject, 
  onAnalyze,
  onViewDetails,
  renderActions
}: TenderListProps) {
  return (
    <Stack gap="md" miw={'100%'}>
      {tenders.map((tender) => (
        <TenderCard
          key={tender.id}
          tender={tender}
          onViewDetails={onViewDetails}
          actionsSlot={renderActions
            ? renderActions(tender)
            : (onReject || onAnalyze)
              ? (
                <TenderCardActions 
                  tenderId={tender.id} 
                />
              )
              : undefined
          }
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
