import { ProteinType, RecipeType, Unit } from "@/lib/generated/prisma";
import { z } from "zod/v4";

const recipeIngredient = z.object({
  referenceId: z.int().meta({
    description:
      "A temporary index, starting from 1, for the ingredient within this recipe. This ID should be used in 'recipeInstructions' to reference the ingredient.",
  }),
  text: z.string().min(1).meta({
    description:
      "The display text for the ingredient, extracted from the original source. This field should contain the name of the ingredient as it should appear in an ingredient list. It must NOT include quantities or units, as these belong in the 'quantity' and 'unit' fields respectively.",
  }),
  name: z.string().min(1).meta({
    description:
      "The unique, internal identifier for a single ingredient. The name must be in singular, lowercase form and contain no special characters like '&'. Multi-word names should also be in singular form and use spaces. Examples: 'mjöl', 'potatis', 'gul lök'. This must represent only one item. If the source text suggests alternatives (e.g., 'ris eller couscous', 'mat & bak smör'), you MUST choose only the most essential term ('ris', 'smör').",
  }),
  note: z.string().optional().meta({
    description:
      // "Any additional information about the ingredient from the source text, that does not belong in the 'text' field. This includes preparation details, package size if the unit is 'FÖRP' (e.g. '(à 400 g)'), or other remarks. If the information is already included elsewhere, leave this field empty",
      "Supplementary details about the ingredient that do not fit in other fields. This includes preparation notes (e.g., 'finhackad', 'rumstempererat'), specific types (e.g., 'gärna ekologisk'), or package information (e.g., '(à 400 g)'). Do NOT repeat information already captured in the 'text', 'quantity', or 'unit' fields. If no such details exist, omit this field.",

    // TODO Improve. Do not allow duplicates from the text
  }),
  quantity: z.number().optional().meta({
    description:
      "The quantity of the ingredient used in the recipe. This should be a number, and it can be a decimal for precision (e.g., 0.5 for half an item).",
  }),
  unit: z.enum(Unit).optional().meta({
    description:
      "The unit of measurement for the ingredient. This must be one of the predefined units. It must appear here, and not in the 'text' field.",
  }),
});

const recipeInstruction = z.object({
  step: z.int().meta({
    description:
      "The step number of the instruction in the recipe. This should be a sequential integer starting from 1, indicating the order of the instruction in the recipe.",
  }),
  text: z.string().min(1).meta({
    description:
      "The text of the instruction, detailing how to prepare the recipe.",
  }),
  ingredientIds: z
    .array(z.int())
    .optional()
    .meta({
      description: `
Reference IDs of 'recipeIngredients' used for the first time in this instruction.
Only include an ingredient reference ID if it is being used for the first time, unless only part of the ingredient was used previously—in that case, you may reference the same ID again.

Example:
If recipeIngredients = [{id: 1, name: "ägg"}, {id: 2, name: "mjölk"}]
- Instruction 1: "Knäck ägget i en skål." → ingredientIds: [1]
- Instruction 2: "Tillsätt mjölken och hälften av ägget." → ingredientIds: [2, 1]
- Instruction 3: "Använd resten av ägget." → ingredientIds: [1]
`,
    }),
});

export const generatedRecipeSchema = z.object({
  name: z.string().min(1).meta({
    description: "The provided name of the recipe, in Swedish.",
  }),
  description: z.string().optional().meta({
    description:
      "A brief description of the recipe in Swedish, taken directly from the source without modification.",
  }),
  recipeYield: z.int().optional().meta({
    description: "The number of servings the recipe yields.",
  }),
  imageUrl: z.string().optional().meta({
    description:
      "This should be a valid Web URL pointing to an image file. If not available, this field should be omitted.",
  }),
  recipeType: z.enum(RecipeType).meta({
    description:
      "The type of the recipe, such as 'HUVUDRÄTT', 'EFTERRÄTT', etc. This should be one of the predefined types.",
  }),
  proteinType: z.enum(ProteinType).optional().meta({
    description:
      "The main protein type of the recipe, if applicable. If not applicable, this field should be omitted.",
  }),
  recipeIngredients: z.array(recipeIngredient).min(1).meta({
    description: "An array of ingredients used in the recipe.",
  }),
  recipeInstructions: z.array(recipeInstruction).min(1).meta({
    description: "An array of instructions for preparing the recipe.",
  }),
  originalAuthor: z.string().optional().meta({
    description: "The original author of the recipe, if known.",
  }),
  totalTimeSeconds: z.int().optional().meta({
    description:
      "The total time required to prepare the recipe, in seconds. If not applicable or unknown, this field should be omitted.",
  }),
  oven: z.nullable(z.int()).meta({
    description:
      "The oven temperature in degrees Celsius, if applicable. Use null if not applicable.",
  }),
});

export const recipeJsonSchema = z.toJSONSchema(generatedRecipeSchema);
export type GeneratedRecipe = z.infer<typeof generatedRecipeSchema>;

/**
 * Gemini API doesn't seem to support the JSON Schemas obtained from Zod with z.literal().
 * I'm using a workaround with z.enum() instead.
 */

export const recipeLlmResponseSchema = z.discriminatedUnion("status", [
  z.object({ status: z.enum(["success"]), data: generatedRecipeSchema }),
  z.object({ status: z.enum(["failed"]), error: z.string().min(1) }),
]);

export const recipeLlmResponseJsonSchema = z.toJSONSchema(
  recipeLlmResponseSchema,
);
export type RecipeLlmResponse = z.infer<typeof recipeLlmResponseSchema>;
