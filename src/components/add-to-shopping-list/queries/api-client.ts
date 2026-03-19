import { recipeIngredientsSourceSchema } from "@/lib/schemas/recipe-ingredient";
import { createFetch, createSchema } from "@better-fetch/fetch";
import { z } from "zod";

const zodSchema = createSchema({
  "/api/recipes/ingredients": {
    query: z
      .object({
        recipeIds: z.array(z.cuid2()).optional(),
        scheduledRecipeIds: z.array(z.cuid2()).optional(),
      })
      // Transform arrays into comma-separated strings
      .transform((data) => ({
        recipeIds: data.recipeIds?.join(","),
        scheduledRecipeIds: data.scheduledRecipeIds?.join(","),
      })),
    output: z.record(z.cuid2(), recipeIngredientsSourceSchema),
  },
});

export const apiClient = createFetch({
  baseURL: process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000",
  schema: zodSchema,
  throw: true,
});
