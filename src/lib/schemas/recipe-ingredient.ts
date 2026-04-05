import { Unit } from "@/lib/generated/prisma";
import z from "zod";

const sourceTypeSchema = z.literal(["RECIPE", "SCHEDULED"]);

export const recipeIngredientSchema = z.object({
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
  categoryId: z.cuid2(),
});

export const recipeIngredientsSourceSchema = z.object({
  sourceId: z.cuid2(), // recipe OR scheduled recipe ID
  sourceType: sourceTypeSchema,
  name: z.string(),
  servings: z.number().nullable().optional(), // only from scheduled recipes
  baseServings: z.number().nullable(),
  recipeIngredients: z.array(recipeIngredientSchema),
});

export type RecipeIngredientsSource = z.infer<
  typeof recipeIngredientsSourceSchema
>;

export const addIngredientToShoppingListInputSchema = z.object({
  ingredientId: z.cuid2(),
  name: z.string(),
  quantity: z.number().nullable(),
  unit: z.enum(Unit).nullable(),
  categoryId: z.cuid2(),
  scheduledRecipeId: z.cuid2().optional(),
});

export type AddIngredientToShoppingListInput = z.infer<
  typeof addIngredientToShoppingListInputSchema
>;
