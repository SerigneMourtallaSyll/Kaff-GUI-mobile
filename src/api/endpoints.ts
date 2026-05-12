/**
 * Centralised API endpoint catalogue.
 * Keep one symbol per route — search-friendly and refactor-safe.
 */

export const ENDPOINTS = {
  auth: {
    login: '/auth/login/',
    register: '/auth/register/',
    refresh: '/auth/refresh/',
    logout: '/auth/logout/',
    me: '/auth/me/',
  },
  pigeons: {
    list: '/pigeons/',
    detail: (id: string) => `/pigeons/${id}/`,
    create: '/pigeons/',
    update: (id: string) => `/pigeons/${id}/`,
    genealogy: (id: string) => `/pigeons/${id}/genealogy/`,
  },
  cages: {
    list: '/cages/',
    detail: (id: string) => `/cages/${id}/`,
    create: '/cages/',
    update: (id: string) => `/cages/${id}/`,
    delete: (id: string) => `/cages/${id}/`,
    occupations: (id: string) => `/cages/${id}/occupations/`,
    assignPigeon: (id: string) => `/cages/${id}/assign-pigeon/`,
    assignCouple: (id: string) => `/cages/${id}/assign-couple/`,
    release: (id: string) => `/cages/${id}/release/`,
    grid: '/cages/grid/',
  },
  couples: {
    list: '/couples/',
    detail: (id: string) => `/couples/${id}/`,
    create: '/couples/',
    dissolve: (id: string) => `/couples/${id}/dissolve/`,
    availablePigeons: '/couples/available-pigeons/',
  },
  reproductions: {
    list: '/reproductions/',
    detail: (id: string) => `/reproductions/${id}/`,
    create: '/reproductions/',
    addPigeonneaux: (id: string) => `/reproductions/${id}/pigeonneaux/`,
  },
  sorties: {
    list: '/sorties/',
    detail: (id: string) => `/sorties/${id}/`,
    create: '/sorties/',
  },
  dashboard: {
    stats: '/dashboard/stats/',
    recent: '/dashboard/recent-activity/',
  },
} as const;
