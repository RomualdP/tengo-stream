import { Card, Text, Group, Button, Stack, Box } from '@mantine/core';
import { IconBuilding, IconCalendar, IconCurrencyEuro, IconClock, IconMapPin, IconPackage } from '@tabler/icons-react';
import { useState } from 'react';
import type { Tender } from '../types';

interface TenderCardProps {
  tender: Tender;
  onReject?: (tenderId: number) => void;
  onAnalyze?: (tenderId: number) => void;
}

export function TenderCard({ tender, onReject, onAnalyze }: TenderCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReject = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onReject?.(tender.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyze = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onAnalyze?.(tender.id);
    } finally {
      setIsProcessing(false);
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M€`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}k€`;
    }
    return `${amount}€`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'green';
      case 'CLOSED': return 'red';
      case 'CANCELLED': return 'gray';
      default: return 'blue';
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="sm">
        {/* Header with organization */}
        <Group gap="xs">
          <IconBuilding size={16} />
          <Text size="sm" fw={500} truncate>
            {tender.buyer.originalName}
          </Text>
        </Group>

        {/* Title */}
        <Text size="sm" lineClamp={2}>
          {tender.title}
        </Text>

        {/* Key details */}
        <Group gap="md" wrap="wrap">
          <Group gap="xs">
            <IconCalendar size={14} />
            <Text size="xs" c="dimmed">
              {getStatusColor(tender.status) === 'green' ? 'Ouvert' : tender.status}
            </Text>
            <Text size="xs">
              {formatDate(tender.publicationDate)} → {formatDate(tender.responseDeadline)}
            </Text>
          </Group>

          <Group gap="xs">
            <IconCurrencyEuro size={14} />
            <Text size="xs">
              {tender.estimatedValueInEur ? formatAmount(tender.estimatedValueInEur) : '-'}
            </Text>
          </Group>

          <Group gap="xs">
            <IconClock size={14} />
            <Text size="xs">
              {tender.durationInMonth ? `${tender.durationInMonth} mois` : '-'}
            </Text>
          </Group>

          <Group gap="xs">
            <IconMapPin size={14} />
            <Text size="xs">
              {typeof tender.executionLocation === 'string' 
                ? tender.executionLocation 
                : tender.executionLocation?.postalCode || '-'}
            </Text>
          </Group>

          <Group gap="xs">
            <IconPackage size={14} />
            <Text size="xs">
              Non alloti
            </Text>
          </Group>
        </Group>

        {/* CPV if available */}
        {tender.cpvAsString.length > 0 && (
          <Box>
            <Text size="xs" c="dimmed">
              CPV {tender.cpvAsString[0]}
            </Text>
          </Box>
        )}

        {/* Action buttons */}
        <Group justify="flex-end" gap="sm">
          <Button
            variant="outline"
            color="red"
            size="xs"
            onClick={handleReject}
            disabled={isProcessing}
            loading={isProcessing}
          >
            X Rejeter
          </Button>
          <Button
            variant="filled"
            color="blue"
            size="xs"
            onClick={handleAnalyze}
            disabled={isProcessing}
            loading={isProcessing}
          >
            ✓ À analyser
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
