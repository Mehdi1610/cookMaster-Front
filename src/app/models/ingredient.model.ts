export type Unit= 'g' | 'kg' | 'ml' | 'l' | 'cas' | 'cac' | 'piece' | 'pincee';

export interface Ingredient{
    id: number;
    name: string;
    quantity: number;
    unit: Unit;
}