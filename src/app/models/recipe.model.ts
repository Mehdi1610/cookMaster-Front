import { CreateIngredientPayload, UpdateIngredientPayload , Ingredient } from "./ingredient.model";
import { CreateStepPayload, UpdateStepPayload, Step } from "./step.model";

export type Difficulty = 'Facile' | 'Moyen' | 'Difficile';

export interface Recipe {
  id: number;
  title: string;
  preparationTime: number; 
  difficulty: Difficulty;
  imageUrl: string;
  userId: number;
  categoryId: number;
  steps: Step[];
  ingredients: Ingredient[];
}

// --- Payload pour la création de recette (sans id) ---

export interface CreateRecipePayload {
  title: string;
  preparationTime: number;
  difficulty: Difficulty;
  categoryId: number;
  steps: CreateStepPayload[];
  ingredients: CreateIngredientPayload[];
}

export interface UpdateRecipePayload {
  title: string;
  preparationTime: number;
  difficulty: Difficulty;
  categoryId: number;
  steps: UpdateStepPayload[];
  ingredients: UpdateIngredientPayload[];
}