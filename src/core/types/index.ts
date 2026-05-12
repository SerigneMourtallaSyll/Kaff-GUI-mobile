/**
 * Cross-cutting types shared by features.
 * Feature-specific types live inside `src/features/<feature>/types`.
 */

export type UUID = string & { readonly __brand: 'UUID' };

export type ISODate = string & { readonly __brand: 'ISODate' };

export type ISODateTime = string & { readonly __brand: 'ISODateTime' };

export type Paginated<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};

export const asUUID = (value: string): UUID => value as UUID;
export const asISODate = (value: string): ISODate => value as ISODate;
export const asISODateTime = (value: string): ISODateTime => value as ISODateTime;
