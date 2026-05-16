/**
 * Pigeons feature — public API.
 */

// Types
export * from './types';

// Schemas (for form validation)
export {
  createPigeonInputSchema,
  updatePigeonInputSchema,
  venteInputSchema,
  decesInputSchema,
  perteInputSchema,
} from './schemas';

// Hooks
export { usePigeons } from './hooks/usePigeons';
export { usePigeon } from './hooks/usePigeon';
export { useCreatePigeon } from './hooks/useCreatePigeon';
export { useUpdatePigeon } from './hooks/useUpdatePigeon';
export { useGenealogy } from './hooks/useGenealogy';
export { useVendrePigeon } from './hooks/useVendrePigeon';
export { useDeclarerDeces } from './hooks/useDeclarerDeces';
export { useDeclarerPerte } from './hooks/useDeclarerPerte';
