"use server";

import { updateScheduledRecipesServings } from "@/data/scheduled-recipe/mutations";
import { createShoppingListItemsFromIngredients } from "@/data/shopping-list-item/mutations";
import { requireUser } from "@/data/user/verify-user";
import { addIngredientToShoppingListInputSchema } from "@/lib/schemas/recipe-ingredient";
import { ActionResponse } from "@/lib/types/api";
import { revalidatePath } from "next/cache";
import z from "zod";

// Local schema
const addIngredientsToShoppingListSchema = z.object({
  ingredients: z.array(addIngredientToShoppingListInputSchema),
  listId: z.cuid2(),
  scheduledRecipeUpdates: z
    .array(
      z.object({
        id: z.cuid2(),
        servings: z.int().min(1),
      }),
    )
    .optional(),
});

export async function addIngredientsToShoppingList(
  data: z.infer<typeof addIngredientsToShoppingListSchema>,
): Promise<ActionResponse> {
  await requireUser();

  // Validate data
  const validated = addIngredientsToShoppingListSchema.safeParse(data);

  // Return early if validation fails
  if (!validated.success) {
    return { success: false, errorCode: "VALIDATION_FAILED" };
  }

  const { ingredients, listId, scheduledRecipeUpdates } = validated.data;

  // Mutate shopping list with validated data
  const mutationRes = await createShoppingListItemsFromIngredients({
    listId,
    data: ingredients,
  });

  // Return error if mutation fails
  if (!mutationRes.ok) {
    return {
      success: false,
      errorCode: mutationRes.errorCode,
    };
  }

  // Update scheduled recipes servings if any
  if (scheduledRecipeUpdates && scheduledRecipeUpdates?.length > 0) {
    const updateRes = await updateScheduledRecipesServings(
      scheduledRecipeUpdates,
    );

    // Return error if mutation fails
    if (!updateRes.ok) {
      return {
        success: false,
        errorCode: updateRes.errorCode,
      };
    }
  }

  // Revalidate paths
  revalidatePath(`/shopping-list/${listId}`);
  revalidatePath("/schedule", "layout");

  return { success: true };
}
