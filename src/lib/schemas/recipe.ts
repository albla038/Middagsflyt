import { ProteinType, RecipeType } from "@/lib/generated/prisma";
import { z } from "zod/v4";

export const recipeDisplayContentSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  recipeYield: z.number().nullable(),
  imageUrl: z.string().nullable(),
  recipeType: z.enum(RecipeType),
  proteinType: z.enum(ProteinType).nullable(),
  totalTimeSeconds: z.number().nullable(),
  isSaved: z.boolean(),
  isImported: z.boolean().optional(),
  isCreatedByUser: z.boolean().optional(),
  scheduledDates: z.array(z.date()).optional(),
});

export type RecipeDisplayContent = z.infer<typeof recipeDisplayContentSchema>;