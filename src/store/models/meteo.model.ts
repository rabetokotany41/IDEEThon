export interface MeteoAlerte {
  type: 'cyclone' | 'forte_pluie' | 'vent_violent' | 'secheresse';
  niveau: 'jaune' | 'orange' | 'rouge';
}

export interface PrevisionJour {
  date: Date;
  tempMinC: number;
  tempMaxC: number;
  pluieMm: number;
  humiditePercent: number;
  ventKmh: number;
  alerte?: MeteoAlerte;
}

export interface MeteoRegion {
  region: string;
  forecasts: PrevisionJour[];     // Généralement 3 à 5 jours
  updatedAt: Date;
  source: 'api' | 'admin';
}