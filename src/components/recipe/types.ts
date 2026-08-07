import { Unit } from "@/lib/generated/prisma";

export type IngredientContent = {
  id: string;
  text: string;
  note: string | null;
  quantity: number | null;
  unit: Unit | null;
};

export type InstructionContent = {
  id: string;
  text: string;
  recipeIngredients: string[];
};
