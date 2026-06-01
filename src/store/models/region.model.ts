export interface Region {
  id: string;
  name: string;                  // Ex: "Analamanga"
  nameMg?: string;
  centerLat?: number;
  centerLng?: number;
}

export interface District {
  id: string;
  regionId: string;
  name: string;
}

export interface Commune {
  id: string;
  districtId: string;
  name: string;
}