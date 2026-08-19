import { ProteinType, RecipeType } from "@/lib/generated/prisma";
import { User } from "better-auth";

export type ScheduledRecipeDisplayContent = {
  id: string;
  date: Date;
  servings: number | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  recipe: {
    id: string;
    slug: string;
    name: string;
    recipeType: RecipeType;
    proteinType: ProteinType | null;
    totalTimeSeconds: number | null;
  };
  assignee: User | null;
};