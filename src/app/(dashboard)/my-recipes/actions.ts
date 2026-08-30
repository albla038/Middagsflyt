"use server";

import { upsertRecipe } from "@/data/recipe/mutations";
import { saveRecipe } from "@/data/saved-recipe/mutations";
import { requireUser } from "@/data/user/verify-user";
import {
  RecipeDraftFormOutput,
  recipeDraftSchema,
  RecipePublishFormOutput,
  recipePublishSchema,
} from "@/lib/schemas/recipe";
import { ActionResponse } from "@/lib/types/api";
import { revalidatePath } from "next/cache";

export async function saveRecipeDraftAction(
  payload: RecipeDraftFormOutput,
): Promise<ActionResponse> {
  await requireUser();

  // Validate payload
  const validated = recipeDraftSchema.safeParse(payload);

  // Return error code if validation fails
  if (!validated.success) {
    return { success: false, errorCode: "VALIDATION_FAILED" };
  }

  // Store the recipe draft in the database
  const mutationRes = await upsertRecipe(validated.data);

  // Forward error code if mutation fails
  if (!mutationRes.ok) {
    return { success: false, errorCode: mutationRes.errorCode };
  }

  revalidatePath("/my-recipes", "layout");

  return { success: true };
}

export async function publishRecipeAction(
  payload: RecipePublishFormOutput,
): Promise<ActionResponse> {
  await requireUser();

  // Validate payload
  const validated = recipePublishSchema.safeParse(payload);

  // Return error code if validation fails
  if (!validated.success) {
    return { success: false, errorCode: "VALIDATION_FAILED" };
  }

  // Store and publish the recipe in the database
  const mutationRes = await upsertRecipe(validated.data);

  // Forward error code if mutation fails
  if (!mutationRes.ok) {
    return { success: false, errorCode: mutationRes.errorCode };
  }

  // Add the recipe to the user's household saved recipes
  await saveRecipe(mutationRes.data.recipeId);

  revalidatePath("/", "layout");

  return { success: true };
}
