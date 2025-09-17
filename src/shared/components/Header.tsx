import { Group, TextInput, Button, Avatar, Text, Tabs } from '@mantine/core';
import { IconSearch, IconStar, IconUser, IconArrowLeft } from '@tabler/icons-react';
import type { PageParams } from '../types/navigation';

interface HeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  currentPage: PageParams;
  canGoBack: boolean;
  onNavigateBack: () => void;
}

export function Header({ activeTab, onTabChange, currentPage, canGoBack, onNavigateBack }: HeaderProps) {
  const renderNavigation = () => {
    if (currentPage.type === 'tender-detail') {
      return (
        <Group gap="md">
          <Button 
            variant="subtle" 
            leftSection={<IconArrowLeft size={16} />} 
            onClick={onNavigateBack}
            disabled={!canGoBack}
          >
            Retour
          </Button>
          <Text size="lg" fw={500}>
            Détail du marché
          </Text>
        </Group>
      );
    }

    return (
      <Tabs value={activeTab} onChange={(value) => value && onTabChange(value)}>
        <Tabs.List>
          <Tabs.Tab value="streams">Flux d'opportunités</Tabs.Tab>
          <Tabs.Tab value="pipeline">Pipeline</Tabs.Tab>
        </Tabs.List>
      </Tabs>
    );
  };

  return (
    <Group justify="space-between" h="100%" px="md">
        {/* Logo */}
        <Text size="xl" fw={700} c="blue">
          tengo
        </Text>

      {/* Navigation */}
      {renderNavigation()}

      {/* Search bar */}
      <TextInput
        placeholder="Rechercher un acheteur..."
        leftSection={<IconSearch size={16} />}
        style={{ flex: 1, maxWidth: 400 }}
      />

      {/* User info and actions */}
      <Group gap="sm">
        <Button variant="outline" size="sm">
          Éditer le flux
        </Button>
        <Button variant="subtle" size="sm">
          <IconStar size={16} />
        </Button>
        <Group gap="xs">
          <Avatar size="sm" color="blue">
            <IconUser size={16} />
          </Avatar>
          <div>
            <Text size="sm" fw={500}>Yoann Gauthier</Text>
            <Text size="xs" c="dimmed">Tengo Demo</Text>
          </div>
        </Group>
      </Group>
    </Group>
  );
}
