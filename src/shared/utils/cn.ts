/**
 * `cn` — className merger.
 * Combines `clsx` (conditional classes) with `tailwind-merge` (conflict
 * resolution). Use everywhere Tailwind classes are concatenated.
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
