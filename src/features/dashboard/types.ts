/**
 * Dashboard types — KPIs cross-app.
 */

export interface DashboardStats {
  pigeons: {
    actifs: number;
    vendus: number;
    morts: number;
    perdus: number;
  };
  cages: {
    libres: number;
    occupeesPigeon: number;
    occupeesCouple: number;
  };
  couplesActifs: number;
  dernieresReproductions: RecentReproduction[];
}

export interface RecentReproduction {
  id: string;
  coupleId: string;
  datePonte: string; // ISO date
  dateEclosion: string | null; // ISO date
  nbPigeonneaux: number;
  maleBague: string;
  femelleBague: string;
}
