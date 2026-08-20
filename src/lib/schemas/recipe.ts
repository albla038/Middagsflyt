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

const recipeIngredient = z.object({
  id: z.cuid2(),
  // displayOrder: z.int(), // TODO: Examine this. If it's needed for DnD-kit, it should be a float
  text: z.string().nonempty("Ingrediensen måste ha ett namn"),
  name: z
    .string()
    .nonempty(
      "Ingrediensen måste vara registrerad i Middagsflyt så att systemet kan identifiera den",
    ),
  note: z.string().transform(emptyStringToNull),
  quantity: z.number().optional(), // TODO: Check if string -> number conversion is needed
  unit: z.enum(Unit).optional(),
});

const recipeInstruction = z.object({
  id: z.cuid2(),
  step: z.int(), // TODO: Check if string -> number conversion is needed
  text: z.string().nonempty("Instruktionen får inte vara tom"),
  ingredientIds: z.array(z.cuid2()).optional(),
});

const recipeSchema = z.object({
  name: z.string().nonempty("Receptet måste ha ett namn"),
  description: z.string().transform(emptyStringToNull),
  recipeYield: stringToPositiveIntNullableSchema,
  imageUrl: z
    .string()
    .transform(emptyStringToNull)
    .pipe(z.httpUrl().nullable()),
  recipeType: z.enum(RecipeType),
  proteinType: z
    .string()
    .transform(emptyStringToNull)
    .pipe(z.enum(ProteinType).nullable()),
  totalTimeSeconds: stringToPositiveIntNullableSchema,
  oven: stringToPositiveIntNullableSchema,
  originalAuthor: z.string().transform(emptyStringToNull),
  sourceUrl: z.string().transform(emptyStringToNull),
  status: z.enum(RecipeStatus),

  recipeIngredients: z
    .array(recipeIngredient)
    .nonempty("Ange minst en ingrediens"),
  recipeInstructions: z
    .array(recipeInstruction)
    .nonempty("Ange minst en instruktion"),
});

export const recipeFormSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("DRAFT"),
    // NOTE: undefined arrays may cause problems with useFieldArray() from RHF
    recipe: recipeSchema.partial(),
  }),
  z.object({
    action: z.literal("PUBLISH"),
    recipe: recipeSchema,
  }),
]);

export type RecipeFormInput = z.input<typeof recipeFormSchema>;
export type RecipeForm = z.infer<typeof recipeFormSchema>;
