import { ProteinType, RecipeType, Unit } from "@/lib/generated/prisma";

export type RecipeIngredient = {
  id: string;
  text: string;
  note: string | null;
  quantity: number | null;
  unit: Unit | null;
};

export type RecipeInstruction = {
  id: string;
  text: string;
  recipeIngredients: string[];
};

export type Recipe = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  recipeYield: number | null;
  imageUrl: string | null;

  recipeType: RecipeType;
  proteinType: ProteinType | null;

  totalTimeSeconds: number | null;
  oven: number | null;

  originalAuthor: string | null;
  sourceUrl: string | null;
  isImported: boolean;

  createdAt: Date;
  updatedAt: Date;

  recipeIngredients: RecipeIngredient[];
  recipeInstructions: RecipeInstruction[];

  createdBy: {
    name: string;
    email: string;
    image: string | null;
  } | null;
};
