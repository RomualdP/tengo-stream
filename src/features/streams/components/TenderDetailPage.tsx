import { Container, Title, Stack, Alert, Text, Group, Badge, Button, Card, Divider, Box, Grid } from '@mantine/core';
import { IconAlertCircle, IconRefresh, IconBuilding, IconCalendar, IconCurrencyEuro, IconClock, IconMapPin, IconPackage } from '@tabler/icons-react';
import { useCallback } from 'react';
import { useTenderDetails } from '../hooks/useTenderDetails';

interface TenderDetailPageProps {
  tenderId: number;
}

export function TenderDetailPage({ tenderId }: TenderDetailPageProps) {
  const {
    tender,
    loading,
    error,
    recordDecision,
    refresh,
  } = useTenderDetails(tenderId);

  const handleReject = useCallback(async () => {
    if (tender) {
      await recordDecision(tender.id, 'REJECTED');
    }
  }, [tender, recordDecision]);

  const handleAnalyze = useCallback(async () => {
    if (tender) {
      await recordDecision(tender.id, 'TO_ANALYZE');
    }
  }, [tender, recordDecision]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getLocationText = (location: string | { postalCode: string } | null): string => {
    if (typeof location === 'string') {
      return location;
    }
    if (location && typeof location === 'object' && location.postalCode) {
      return location.postalCode;
    }
    return '-';
  };

  if (loading) {
    return (
      <Container size="lg" py="md">
        <Stack gap="md">
          <Text>Chargement des détails...</Text>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="md">
        <Stack gap="md">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Erreur de chargement"
            color="red"
            variant="light"
          >
            {error}
          </Alert>
        </Stack>
      </Container>
    );
  }

  if (!tender) {
    return (
      <Container size="lg" py="md">
        <Stack gap="md">
          <Text>Marché non trouvé</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg" py="md">
      <Stack gap="md">
        {/* Header with actions */}
        <Group justify="flex-end">
          <Group gap="sm">
            {tender.processed ? (
              <Badge 
                size="lg" 
                variant="light" 
                color={tender.decisionStatus === 'TO_ANALYZE' ? 'green' : 'red'}
              >
                {tender.decisionStatus === 'TO_ANALYZE' ? 'À analyser' : 'Rejeté'}
              </Badge>
            ) : (
              <Group gap="sm">
                <Button
                  variant="outline"
                  color="red"
                  size="sm"
                  onClick={handleReject}
                >
                  X Rejeter
                </Button>
                <Button
                  variant="filled"
                  color="blue"
                  size="sm"
                  onClick={handleAnalyze}
                >
                  ✓ À analyser
                </Button>
              </Group>
            )}
            <Button
              variant="outline"
              size="sm"
              leftSection={<IconRefresh size={14} />}
              onClick={refresh}
              loading={loading}
            >
              Actualiser
            </Button>
          </Group>
        </Group>

        {/* Tender details */}
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="lg">
            {/* Title and organization */}
            <Stack gap="sm">
              <Group gap="xs">
                <IconBuilding size={20} />
                <Text size="lg" fw={600}>
                  {tender.buyer.originalName}
                </Text>
              </Group>
              <Title order={2}>{tender.title}</Title>
            </Stack>

            <Divider />

            {/* Key information grid */}
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="md">
                  <Group gap="xs">
                    <IconCalendar size={16} />
                    <div>
                      <Text size="sm" fw={500}>Date de publication</Text>
                      <Text size="sm">{formatDate(tender.publicationDate)}</Text>
                    </div>
                  </Group>

                  <Group gap="xs">
                    <IconClock size={16} />
                    <div>
                      <Text size="sm" fw={500}>Date limite de réponse</Text>
                      <Text size="sm">{formatDate(tender.responseDeadline)}</Text>
                    </div>
                  </Group>

                  <Group gap="xs">
                    <IconMapPin size={16} />
                    <div>
                      <Text size="sm" fw={500}>Lieu d'exécution</Text>
                      <Text size="sm">{getLocationText(tender.executionLocation)}</Text>
                    </div>
                  </Group>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="md">
                  <Group gap="xs">
                    <IconCurrencyEuro size={16} />
                    <div>
                      <Text size="sm" fw={500}>Valeur estimée</Text>
                      <Text size="sm">{formatCurrency(tender.estimatedValueInEur)}</Text>
                    </div>
                  </Group>

                  <Group gap="xs">
                    <IconClock size={16} />
                    <div>
                      <Text size="sm" fw={500}>Durée</Text>
                      <Text size="sm">
                        {tender.durationInMonth ? `${tender.durationInMonth} mois` : 'Non spécifiée'}
                      </Text>
                    </div>
                  </Group>

                  <Group gap="xs">
                    <IconPackage size={16} />
                    <div>
                      <Text size="sm" fw={500}>Catégorie</Text>
                      <Text size="sm">{tender.category}</Text>
                    </div>
                  </Group>
                </Stack>
              </Grid.Col>
            </Grid>

            {/* CPV codes */}
            {tender.cpvAsString.length > 0 && (
              <>
                <Divider />
                <Stack gap="sm">
                  <Text size="sm" fw={500}>Codes CPV</Text>
                  <Group gap="xs" wrap="wrap">
                    {tender.cpvAsString.map((cpv, index) => (
                      <Badge key={index} variant="light" size="sm">
                        {cpv}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
              </>
            )}

            {/* Buyer contact */}
            <Divider />
            <Stack gap="sm">
              <Text size="sm" fw={500}>Contact acheteur</Text>
              <Box>
                <Text size="sm"><strong>Nom:</strong> {tender.buyer.originalName}</Text>
                <Text size="sm"><strong>Ville:</strong> {tender.buyerContact.location.city}</Text>
                <Text size="sm"><strong>Code postal:</strong> {tender.buyerContact.location.postalCode}</Text>
              </Box>
            </Stack>

            {/* Additional tender information */}
            <Divider />
            <Stack gap="sm">
              <Text size="sm" fw={500}>Informations supplémentaires</Text>
              <Text size="sm">
                <strong>Statut:</strong> {tender.status}
              </Text>
              <Text size="sm">
                <strong>Catégorie:</strong> {tender.category}
              </Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
