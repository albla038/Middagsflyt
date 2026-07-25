"use server";

import { createShoppingListItemsFromIngredients } from "@/data/shopping-list-item/mutations";
import { requireUser } from "@/data/user/verify-user";
import { addIngredientToShoppingListInputSchema } from "@/lib/schemas/recipe-ingredient";
import { ActionResponse } from "@/lib/types/api";
import { revalidatePath } from "next/cache";
import z from "zod";

// Local schema
const addIngredientsToShoppingListSchema = z.object({
  ingredients: z.array(addIngredientToShoppingListInputSchema),
  listId: z.string(),
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

  const { ingredients, listId } = validated.data;

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

  // Revalidate path?
  revalidatePath(`/shopping-list/${listId}`);

  return { success: true, data: undefined };
}
