export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const formatAmount = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M€`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}k€`;
  }
  return `${amount}€`;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'OPEN': return 'green';
    case 'CLOSED': return 'red';
    case 'CANCELLED': return 'gray';
    default: return 'blue';
  }
};
