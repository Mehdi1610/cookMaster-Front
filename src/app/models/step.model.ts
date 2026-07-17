export interface Step{
    id: number;
    description: string;
    stepNumber: number;

}

// --- Payload pour la création de recette (sans id) ---

export interface CreateStepPayload {
  description: string;
  stepNumber: number;
}