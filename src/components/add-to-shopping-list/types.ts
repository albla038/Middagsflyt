import {
  recipeIngredientSchema,
  recipeIngredientsSourceSchema,
} from "@/lib/schemas/recipe-ingredient";
import z from "zod";

// Use Zod to derive UI-specific types that include additional fields needed for the component state
const uiRecipeIngredientSchema = recipeIngredientSchema.extend({
  isSelected: z.boolean(),
});

const uiRecipeIngredientsSourceSchema = recipeIngredientsSourceSchema.extend({
  selectedServings: z.number(),
  recipeIngredients: z.array(uiRecipeIngredientSchema),
});

export type UIRecipeIngredient = z.infer<typeof uiRecipeIngredientSchema>;
export type UIRecipeIngredientsSource = z.infer<
  typeof uiRecipeIngredientsSourceSchema
>;
