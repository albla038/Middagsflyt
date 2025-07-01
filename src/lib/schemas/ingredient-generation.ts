import { z } from "zod/v4";

export const unitSchema = z.enum([
  "KRM",
  "TSK",
  "MSK",
  "CUP",
  "ML",
  "CL",
  "DL",
  "L",
  "G",
  "KG",
  "ST",
  "FÖRP",
  "KLYFTOR",
]);

const ingredientCategorySchema = z.enum([
  "Frukt & Grönt",
  "Kött & Fågel",
  "Chark",
  "Fisk & Skaldjur",
  "Mejeri",
  "Ost",
  "Vegetariskt",
  "Skafferi",
  "Bröd, Kex & Bageri",
  "Frysvaror",
  "Dryck",
  "Snacks & Godis",
  "Glass",
  "Färdigmat & Sallader",
  "Hälsa & Skönhet",
  "Barn",
  "Hem & Hushåll",
  "Fritid",
  "Övrigt",
]);

export const generatedIngredientsSchema = z.array(
  z.object({
    name: z.string().meta({
      description:
        "The unique, internal identifier for the ingredient. Must be in singular, lowercase form. Use spaces for multi-word ingredients. Examples: 'mjöl', 'potatis', 'gul lök'.",
    }),
    aliases: z.array(z.string()).optional().meta({
      description:
        "A list of alternative spellings and/or common misspellings for the ingredient. Each alias should be in lowercase. For example, 'crème fraîche' might have aliases like ['creme fraiche', 'cremefraiche'].",
    }),
    displayNameSingular: z.string().meta({
      description:
        "The display name for a single unit of the ingredient, with appropriate capitalization. Examples: 'Mjöl', 'Potatis', 'Gul lök'.",
    }),
    displayNamePlural: z.string().meta({
      description:
        "The display name for multiple units of the ingredient. For mass nouns (like 'mjöl'), this should be the same as the singular form. Examples: 'Mjöl', 'Potatisar', 'Gula lökar'.",
    }),
    shoppingUnit: unitSchema.meta({
      description:
        "The most common swedish unit for purchasing this ingredient. Choose one from the list. Use 'ST' for ingredients bought in pieces (exempel: 3 st ägg, 2 st paprikor).",
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
