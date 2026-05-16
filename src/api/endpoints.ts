/**
 * Centralised API endpoint catalogue.
 * Keep one symbol per route — search-friendly and refactor-safe.
 *
 * Matches Django backend URL structure exactly.
 */

export const ENDPOINTS = {
  auth: {
    publicKey: '/auth/public-key/',
    register: '/auth/register/',
    registerConfirm: '/auth/register/confirm/',
    login: '/auth/login/',
    verify2FA: '/auth/2fa/verify/',
    refresh: '/auth/refresh/',
    logout: '/auth/logout/',
    me: '/auth/me/',
  },

  dashboard: {
    stats: '/dashboard/',
  },

  pigeons: {
    list: '/pigeons/',
    detail: (id: string) => `/pigeons/${id}/`,
    create: '/pigeons/',
    update: (id: string) => `/pigeons/${id}/`,
    delete: (id: string) => `/pigeons/${id}/`,
    genealogy: (id: string) => `/pigeons/${id}/genealogy/`,
    // Actions de sortie
    vendre: (id: string) => `/pigeons/${id}/vendre/`,
    declarerDeces: (id: string) => `/pigeons/${id}/declarer-deces/`,
    declarerPerte: (id: string) => `/pigeons/${id}/declarer-perte/`,
  },

  cages: {
    list: '/cages/',
    detail: (id: string) => `/cages/${id}/`,
    create: '/cages/',
    update: (id: string) => `/cages/${id}/`,
    delete: (id: string) => `/cages/${id}/`,
    // Visualisation volière (feature centrale)
    volet: '/cages/volet/',
    // Actions d'occupation
    affecterPigeon: (id: string) => `/cages/${id}/affecter-pigeon/`,
    affecterCouple: (id: string) => `/cages/${id}/affecter-couple/`,
    liberer: (id: string) => `/cages/${id}/liberer/`,
  },

  couples: {
    list: '/couples/',
    detail: (id: string) => `/couples/${id}/`,
    create: '/couples/',
    rompre: (id: string) => `/couples/${id}/rompre/`,
  },

  reproductions: {
    list: '/reproductions/',
    detail: (id: string) => `/reproductions/${id}/`,
    create: '/reproductions/',
    pigeonneaux: (id: string) => `/reproductions/${id}/pigeonneaux/`,
  },

  sorties: {
    list: '/sorties/',
    detail: (id: string) => `/sorties/${id}/`,
  },
} as const;
