import { Card, Text, Group, Stack, Box } from '@mantine/core';
import { IconBuilding, IconCalendar, IconCurrencyEuro, IconClock, IconMapPin, IconPackage, IconArrowRight } from '@tabler/icons-react';
import type { Tender } from '../types';
import { formatDate, formatAmount, getStatusColor } from '../utils/tenderFormatters';

interface TenderCardProps {
  tender: Tender;
  onViewDetails?: (tenderId: number) => void;
  actionsSlot?: React.ReactNode;
}

export function TenderCard({ tender, onViewDetails, actionsSlot }: TenderCardProps) {

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ position: 'relative' }}>
      <Stack gap="sm">
        {/* Header with organization and action buttons */}
        <Group justify="space-between">
          <Group gap="xs">
            <IconBuilding size={16} />
            <Text size="sm" fw={500} truncate>
              {tender.buyer.originalName}
            </Text>
          </Group>
          
          {/* Action buttons slot (only provided by Streams page) */}
          {actionsSlot}
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

        {/* CPV */}
        {tender.cpvAsString.length > 0 && (
          <Text size="xs" c="dimmed">
            CPV {tender.cpvAsString[0]}
          </Text>
        )}
        
        {/* Styled arrow button in bottom right corner */}
        <Box
          style={{
            position: 'absolute',
            bottom: '-10px',
            right: '-10px',
            cursor: 'pointer',
            transform: 'rotate(-45deg)',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            padding: '10px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e9ecef',
            transition: 'all 0.2s ease',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => onViewDetails?.(tender.id)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e9ecef';
            e.currentTarget.style.transform = 'rotate(-45deg) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
            e.currentTarget.style.transform = 'rotate(-45deg) scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
          }}
        >
          <IconArrowRight size={16} color="#666" />
        </Box>
      </Stack>
    </Card>
  );
}
