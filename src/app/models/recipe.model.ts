import { Ingredient } from "./ingredient.model";
import { Step } from "./step.model";

export type Difficulty = 'Facile' | 'Moyen' | 'Difficile';
export type Unit = 'G' | 'KG' | 'ML' | 'L' | 'CAS' | 'CAC' | 'PIECE' | 'PINCEE';

export interface Recipe {
  id: number;
  title: string;
  preparationTime: number; // en minutes, d'après l'exemple
  difficulty: Difficulty;
  imageUrl: string;
  userId: string;
  categoryId: number;
  steps: Step[];
  ingredients: Ingredient[];
}