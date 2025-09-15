import { Badge } from '@mantine/core';

interface StreamCounterProps {
  remainingCount: number;
}

export function StreamCounter({ remainingCount }: StreamCounterProps) {
  return (
    <Badge size="lg" variant="light" color="blue">
      {remainingCount} À traiter
    </Badge>
  );
}
