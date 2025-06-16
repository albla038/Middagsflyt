import { z } from "zod/v4";

const recipeIngredientSchema = z.union([
  z.array(z.string().min(1)).min(1),
  z.string().min(1),
]);

const howToStepSchema = z.object({
  "@type": z.literal("HowToStep"),
  text: z.string().min(1),
});

const howToSectionSchema = z.object({
  "@type": z.literal("HowToSection"),
  name: z.string().optional(),
  itemListElement: z
    .array(
      z.object({
        "@type": z.literal("HowToStep"),
        text: z.string().min(1),
      }),
    )
    .min(1),
});

const recipeInstructionsSchema = z.union([
  z.array(z.string().min(1)).min(1),
  z.array(howToStepSchema).min(1),
  z.array(howToSectionSchema).min(1),
  z.string().min(1),
]);

const coercedInt = z.preprocess((val) => {
  if (typeof val === "string") {
    return Number.parseInt(val);
  }
  return val;
}, z.int());

const imageSchema = z.union([
  z.url({
    protocol: /^https?$/,
    hostname: z.regexes.domain,
  }),
  z.object({
    "@type": z.literal("ImageObject"),
    url: z.url({
      protocol: /^https?$/,
      hostname: z.regexes.domain,
    }),
  }),
]);

const authorSchema = z.union([
  z.object({ "@type": z.string(), name: z.string() }),
  z.string().min(1),
]);

/* Based on JSON-LD Recipe Schema
 * https://schema.org/Recipe
 */
export const jsonLdRecipeSchema = z.object({
  "@context": z.url({ hostname: /^schema\.org$/ }),
  "@type": z.literal("Recipe"),
  name: z.string(),
  description: z.string().optional(),
  recipeIngredient: recipeIngredientSchema,
  recipeInstructions: recipeInstructionsSchema,
  recipeYield: coercedInt.optional(),
  image: z.union([imageSchema, z.array(imageSchema)]).optional(),
  author: authorSchema.optional(),
  prepTime: z.iso.duration().optional(),
  cookTime: z.iso.duration().optional(),
  totalTime: z.iso.duration().optional(),
  cookingMethod: z.string().optional(),
  recipeCategory: z.string().optional(),
  recipeCuisine: z.nullish(z.string()).optional(),
});

export type JsonLdRecipe = z.infer<typeof jsonLdRecipeSchema>;
