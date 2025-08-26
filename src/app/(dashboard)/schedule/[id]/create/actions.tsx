"use server";

import { createScheduledRecipe } from "@/data/scheduled-recipe/mutations";
import { requireUser } from "@/data/user/verify-user";
import { ActionState } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { z } from "zod/v4";

type ScheduleRecipeFormState = ActionState<
  void,
  {
    scheduleId?: string[];
    recipeId?: string[];
    date?: string[];
    servings?: string[];
    assigneeId?: string[];
    note?: string[];
  }
>;

const scheduleRecipeSchema = z.object({
  scheduleId: z.cuid2("Ogiltigt kalender-ID"),
  recipeId: z.cuid2("Ogiltigt recept-ID"),
  date: z.date("Ogiltigt datum"),
  servings: z.number().min(1, "Antal portioner måste vara minst 1"),
  assigneeId: z.string("Ogiltigt användar-ID").optional(),
  note: z.preprocess(
    (value) => (value === "" ? null : value),
    z.string("Ange en giltig anteckning").nullable(),
  ),
});

export async function scheduleRecipe(
  scheduleId: string,
  recipeId: string | null,
  date: Date,
  servings: number,
  assigneeId: string | undefined,
  prevState: ScheduleRecipeFormState,
  formData: FormData,
): Promise<ScheduleRecipeFormState> {
  await requireUser();

  const validated = scheduleRecipeSchema.safeParse({
    scheduleId,
    recipeId,
    date,
    servings,
    assigneeId,
    ...Object.fromEntries(formData),
  });

  // Return form errors if validation fails
  if (!validated.success) {
    const errors = z.flattenError(validated.error).fieldErrors;

    if (errors.date) {
      return {
        success: false,
        message: "Ogiltigt datum. Vänligen kontakta supporten",
        errors,
      };
    }

    if (errors.scheduleId || errors.recipeId || errors.assigneeId) {
      return {
        success: false,
        message:
          "Ogiltigt kalender-, recept- eller användar-ID. Vänligen kontakta supporten",
        errors,
      };
    }

    return {
      success: false,
      message: "Ogiltig inmatning. Vänligen försök igen",
      errors,
    };
  }

  const {
    scheduleId: validScheduleId,
    recipeId: validRecipeId,
    date: validDate,
    servings: validServings,
    assigneeId: validAssigneeId,
    note: validNote,
  } = validated.data;

  const mutationResult = await createScheduledRecipe({
    scheduleId: validScheduleId,
    recipeId: validRecipeId,
    date: validDate,
    servings: validServings,
    assigneeId: validAssigneeId,
    note: validNote,
  });

  if (!mutationResult.ok) {
    return {
      success: false,
      message:
        "Något gick fel när receptet skulle schemaläggas. Vänligen försök igen!",
    };
  }

  revalidatePath(`/schedule/${scheduleId}`);

  return {
    success: true,
    message: "Receptet har schemalagts!",
  };
}
