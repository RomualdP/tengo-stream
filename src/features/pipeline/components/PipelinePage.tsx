import { Container, Title, Stack, Alert, Text, Group, Badge, Button } from '@mantine/core';
import { IconAlertCircle, IconClipboardList, IconRefresh } from '@tabler/icons-react';
import { TenderList } from '../../streams/components/TenderList';
import { usePipeline } from '../hooks/usePipeline';

export function PipelinePage() {
  const {
    tenders,
    loading,
    error,
    totalCount,
    refresh,
  } = usePipeline();

  return (
    <Container size="lg" py="md">
      <Stack gap="md">
        {/* Pipeline title and counter */}
        <Group justify="space-between">
          <Title order={2}>Pipeline</Title>
          <Group gap="sm">
            <Badge size="lg" variant="light" color="green">
              {totalCount} À analyser
            </Badge>
            <Button
              variant="outline"
              size="xs"
              leftSection={<IconRefresh size={14} />}
              onClick={refresh}
              loading={loading}
            >
              Actualiser
            </Button>
          </Group>
        </Group>

        {/* Description */}
        <Text size="sm" c="dimmed">
          Marchés sélectionnés pour analyse approfondie
        </Text>

        {/* Error state */}
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Erreur de chargement"
            color="red"
            variant="light"
          >
            {error}
          </Alert>
        )}

        {/* Empty state */}
        {!loading && tenders.length === 0 && (
          <Alert
            icon={<IconClipboardList size={16} />}
            title="Pipeline vide"
            color="blue"
            variant="light"
          >
            Aucun marché n'a encore été sélectionné pour analyse.
            Retournez aux flux d'opportunités pour sélectionner des marchés.
          </Alert>
        )}

        {/* Tender list */}
        <TenderList
          tenders={tenders}
          loading={loading}
          hasMore={false}
          onReject={undefined}
          onAnalyze={undefined}
        />
      </Stack>
    </Container>
  );
}
