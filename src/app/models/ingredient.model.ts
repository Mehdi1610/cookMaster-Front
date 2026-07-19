export type Unit= 'G' | 'KG' | 'ML' | 'L' | 'CAS' | 'CAC' | 'PIECE' | 'PINCEE' | 'AUTRE';


export interface Ingredient{
    id: number;
    name: string;
    quantity: number;
    unit: Unit;
}

// --- Payload pour la création de recette (sans id) ---

export interface CreateIngredientPayload {
  name: string;
  quantity: number;
  unit: Unit;
}

export interface UpdateIngredientPayload {
  id?: number; 
  name: string;
  quantity: number;
  unit: Unit;
}