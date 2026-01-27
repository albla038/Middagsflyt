"use server";

import { deleteShoppingListItems } from "@/data/shopping-list-item/mutations";
import { requireUser } from "@/data/user/verify-user";
import { ActionResult } from "@/lib/types";
import {
  ShoppingListItemsDelete,
  shoppingListItemsDeleteSchema,
} from "@/queries/shopping-list/schemas";
import z from "zod";

type DeleteItemsResult = ActionResult<
  void,
  { listId?: string[]; itemsIds?: string[] }
>;

export async function deleteShoppingListItemsAction(
  data: ShoppingListItemsDelete,
): Promise<DeleteItemsResult> {
  await requireUser();

  // Validate input data
  const validated = shoppingListItemsDeleteSchema.safeParse(data);

  // Return errors if validation fails
  if (!validated.success) {
    const errors = z.flattenError(validated.error).fieldErrors;

    return {
      success: false,
      message: "Ogiltiga ID:n. Vänligen kontakta supporten",
      errors,
    };
  }

  const deleteResult = await deleteShoppingListItems(validated.data);

  // Return error if deletion fails
  if (!deleteResult.ok) {
    return {
      success: false,
      message:
        "Något gick fel när varorna skulle tas bort. Vänligen försök igen.",
    };
  }

  return {
    success: true,
    message: "Varorna togs bort",
  };
}
