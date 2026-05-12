/**
 * Pure, side-effect-free formatters used across features.
 */
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (iso: string, pattern = 'dd MMM yyyy'): string => {
  try {
    return format(parseISO(iso), pattern, { locale: fr });
  } catch {
    return '—';
  }
};

export const formatRelative = (iso: string): string => {
  try {
    return formatDistanceToNow(parseISO(iso), { locale: fr, addSuffix: true });
  } catch {
    return '—';
  }
};

export const formatPriceFcfa = (value: number): string =>
  `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value)} FCFA`;
