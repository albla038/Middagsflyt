import {
  ProteinType,
  RecipeStatus,
  RecipeType,
  Unit,
} from "@/lib/generated/prisma/enums";
import { emptyStringToNull, stringToNumberOrNull } from "@/lib/schemas/utils";
import z from "zod";

export const recipeCardDisplayContentSchema = z.object({
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

export type RecipeCardDisplayContent = z.infer<
  typeof recipeCardDisplayContentSchema
>;

const stringToPositiveIntNullableSchema = z
  .string()
  .transform(stringToNumberOrNull)
  .pipe(z.int().positive("Ange ett positivt värde").nullable());

const stringToLinkNullableSchema = z
  .string()
  .transform(emptyStringToNull)
  .pipe(z.httpUrl("Ange en giltig webbadress: https://...").nullable());

const recipeIngredient = z.object({
  id: z.cuid2(),
  // displayOrder: z.int(), // TODO: Examine this. If it's needed for DnD-kit, it should be a float
  text: z.string().nonempty("Ingrediensen måste ha ett namn"),
  canonicalName: z
    .string()
    .nonempty(
      "Ingrediensen måste vara registrerad i Middagsflyt så att systemet kan identifiera den",
    ),
  note: z.string().transform(emptyStringToNull),
  quantity: stringToPositiveIntNullableSchema,
  unit: z.enum(Unit).optional(),
});

const recipeInstruction = z.object({
  id: z.cuid2(),
  step: z.int(), // TODO: Check if string -> number conversion is needed
  text: z.string().nonempty("Instruktionen får inte vara tom"),
  ingredientIds: z.array(z.cuid2()),
});

const baseRecipeSchema = z.object({
  name: z.string(),
  description: z.string().transform(emptyStringToNull),
  recipeYield: stringToPositiveIntNullableSchema,
  imageUrl: stringToLinkNullableSchema,
  recipeType: z.enum(RecipeType),
  proteinType: z
    .string()
    .transform(emptyStringToNull)
    .pipe(z.enum(ProteinType).nullable()),
  totalTimeSeconds: stringToPositiveIntNullableSchema,
  oven: stringToPositiveIntNullableSchema,
  originalAuthor: z.string().transform(emptyStringToNull),
  sourceUrl: stringToLinkNullableSchema,
  status: z.enum(RecipeStatus),
  isPublic: z.boolean(),

  recipeIngredients: z.array(recipeIngredient),
  recipeInstructions: z.array(recipeInstruction),
});

export const recipeFormSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("DRAFT"),
    recipe: baseRecipeSchema,
  }),
  z.object({
    action: z.literal("PUBLISH"),
    recipe: baseRecipeSchema.extend({
      name: z.string().nonempty("Receptet måste ha ett namn"),

      recipeIngredients: z
        .array(recipeIngredient)
        .nonempty("Ange minst en ingrediens"),
      recipeInstructions: z
        .array(recipeInstruction)
        .nonempty("Ange minst en instruktion"),
    }),
  }),
]);

export type RecipeFormInput = z.input<typeof recipeFormSchema>;
export type RecipeForm = z.infer<typeof recipeFormSchema>;
