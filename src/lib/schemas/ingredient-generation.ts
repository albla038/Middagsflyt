import z from "zod";

import { Unit } from "@/lib/generated/prisma";
import { fetchIngredientCategories } from "@/data/ingredient-category/queries";

const ingredientCategorySchema = z.enum(await fetchIngredientCategories());

export const generatedIngredientsSchema = z.array(
  z.object({
    name: z.string().meta({
      description:
        "The unique, internal identifier for a single ingredient. The name must be in singular, lowercase form. Use spaces for multi-word ingredients. Examples: 'mjöl', 'potatis', 'gul lök'.", // TODO Maybe use the provided name directly
    }),
    aliases: z.array(z.string()).optional().meta({
      description:
        "A list of alternative names, common misspellings, or synonyms for the ingredient. It is important to provide these if they exist. All aliases must be in lowercase. For example, for 'crème fraîche', provide ['creme fraiche', 'cremefraiche']. For 'isbergssallad', provide ['isbergssallat'].",
    }),
    displayNameSingular: z.string().meta({
      description:
        "The display name for a single unit of the ingredient, with appropriate capitalization. Examples: 'Mjöl', 'Potatis', 'Gul lök'.",
    }),
    displayNamePlural: z.string().meta({
      description:
        "The display name for multiple units of the ingredient. For mass nouns (like 'mjöl'), this should be the same as the singular form. Examples: 'Mjöl', 'Potatisar', 'Gula lökar'.",
    }),
    shoppingUnit: z.enum(Unit).meta({
      description:
        "The most common Swedish unit for purchasing this ingredient. Choose one from the list. Use 'ST' only for items sold individually (e.g., 3 st ägg, 2 st paprikor). For packaged goods, use the unit on the package, typically 'G' for weight (e.g., a can of 'krossade tomater') or 'ML'/'L' for volume (e.g., a carton of 'mjölk', a tube of 'tomatpuré'). Prefer 'G' over 'KG'.",
      // The unit 'FÖRP' is generic and should be avoided; specify a weight or volume unit instead, if applicable.
    }),
    ingredientCategory: z.object({
      name: ingredientCategorySchema.meta({
        description:
          "The most fitting grocery store category for this ingredient. Choose one from the list.",
      }),
    }),
  }),
);

export type GeneratedIngredients = z.infer<typeof generatedIngredientsSchema>;

export const generatedIngredientsJsonSchema = z.toJSONSchema(
  generatedIngredientsSchema,
);
