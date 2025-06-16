import { z } from "zod/v4";

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
]);

const coercedInt = z.preprocess((val) => {
  if (typeof val === "string") {
    return Number.parseInt(val);
  }
  return val;
}, z.int());

/* Based on JSON-LD Recipe Schema
 * https://schema.org/Recipe
 */
export const jsonLdRecipeSchema = z.object({
  "@context": z.literal("http://schema.org/"),
  "@type": z.literal("Recipe"),
  name: z.string(),
  description: z.string().optional(),
  recipeIngredient: z.array(z.string().min(1)).min(1),
  recipeInstructions: recipeInstructionsSchema,
  recipeYield: coercedInt.optional(),
  image: z
    .url({
      protocol: /^https?$/,
      hostname: z.regexes.domain,
    })
    .optional(),
  author: z.object({ "@type": z.string(), name: z.string() }).optional(),
  datePublished: z.iso.date().optional(),
  prepTime: z.iso.duration().optional(),
  cookTime: z.iso.duration().optional(),
  totalTime: z.iso.duration().optional(),
  cookingMethod: z.string().optional(),
  recipeCategory: z.string().optional(),
  recipeCuisine: z.string().optional(),
});
