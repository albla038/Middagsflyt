import { Unit } from "@/lib/generated/prisma";
import z from "zod";

export const recipeIngredientsSourceSchema = z.object({
  sourceId: z.cuid2(), // recipe OR scheduled recipe ID
  sourceType: z.literal(["RECIPE", "SCHEDULED"]),
  name: z.string(),
  servings: z.number().nullable().optional(), // only from scheduled recipes
  baseServings: z.number().nullable(),
  recipeIngredients: z.array(
    z.object({
      // From recipe ingredient relation
      recipeIngredientId: z.cuid2(),
      text: z.string(),
      note: z.string().nullable(),
      quantity: z.number().nullable(),
      unit: z.enum(Unit).nullable(),

      // From ingredient relation
      ingredientId: z.cuid2(),
      name: z.string(),
      displayNameSingular: z.string(),
      displayNamePlural: z.string(),
    }),
  ),
});

export type RecipeIngredientsSource = z.infer<
  typeof recipeIngredientsSourceSchema
>;
