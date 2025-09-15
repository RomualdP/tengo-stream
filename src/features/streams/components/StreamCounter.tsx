import { Badge, Group } from '@mantine/core';

interface StreamCounterProps {
  remainingCount: number;
  totalCount?: number;
}

export function StreamCounter({ remainingCount, totalCount }: StreamCounterProps) {
  return (
    <Group gap="sm">
      <Badge size="lg" variant="light" color="blue">
        {remainingCount} À traiter
      </Badge>
      {totalCount && (
        <Badge size="sm" variant="outline" color="gray">
          {totalCount} Total
        </Badge>
      )}
    </Group>
  );
}
