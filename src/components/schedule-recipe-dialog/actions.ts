"use server";

import { createScheduledRecipe } from "@/data/scheduled-recipe/mutations";
import { requireUser } from "@/data/user/verify-user";
import {
  ScheduleRecipeCreate,
  scheduleRecipeCreateSchema,
} from "@/lib/schemas/scheduled-recipe";
import { ActionResponse } from "@/lib/types/api";
import { revalidatePath } from "next/cache";

export async function createScheduledRecipeAction(
  data: ScheduleRecipeCreate,
): Promise<ActionResponse> {
  await requireUser();

  // Validate the input
  const validated = scheduleRecipeCreateSchema.safeParse(data);

  // Return error code if validation fails
  if (!validated.success) {
    return { success: false, errorCode: "VALIDATION_FAILED" };
  }

  // Call DAL mutation
  const mutationRes = await createScheduledRecipe(validated.data);

  // Return error code if mutation fails
  if (!mutationRes.ok) {
    return { success: false, errorCode: mutationRes.errorCode };
  }

  // Revalidate full client cache (recipes, shopping lists, schedules, etc. display scheduled recipe data)
  revalidatePath("/", "layout");

  return { success: true };
}
