import { z } from "zod/v4";

export const recipeSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).optional(),
  ingredients: z
    .array(
      z.object({
        id: z.int(),
        name: z.string().min(1),
        prePreparation: z.string().optional(),
        postPreparation: z.string().optional(),
        quantity: z.number().optional(),
        unit: z.string().optional(), //replace with array literal
      }),
    )
    .min(1),
  instructions: z
    .array(
      z.object({
        id: z.int(),
        text: z.string().min(1),
        ingredientIds: z.array(z.int()).optional(),
      }),
    )
    .min(1),
  oven: z.nullable(z.int()),
});

export const recipeJsonSchema = z.toJSONSchema(recipeSchema);
export type Recipe = z.infer<typeof recipeSchema>;

/**
 * Gemini API doesn't seem to support the JSON Schemas obtained from Zod with z.literal().
 * I'm using a workaround with z.enum() instead.
 */

export const recipeLlmResponseSchema = z.discriminatedUnion("status", [
  z.object({ status: z.enum(["success"]), data: recipeSchema }),
  z.object({ status: z.enum(["failed"]), error: z.string().min(1) }),
]);

export const recipeLlmResponseJsonSchema = z.toJSONSchema(
  recipeLlmResponseSchema,
);
export type RecipeLlmResponse = z.infer<typeof recipeLlmResponseSchema>;

// Consider using metadata in the schema for some fields to enrich the derived JSON schema
