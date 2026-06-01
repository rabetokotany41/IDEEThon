export interface Product {
  id: string;
  name: string;                  // Ex: "Tomate"
  nameMg?: string;               // Nom en malgache
  category: 'legume' | 'fruit' | 'cereale' | 'tubercule' | 'elevage';
  unit: 'kg' | 'piece' | 'botte';
  imageUrl?: string;
  isActive: boolean;
}