"use server";

import { deleteShoppingListItems } from "@/data/shopping-list-item/mutations";
import { requireUser } from "@/data/user/verify-user";
import { ActionResult } from "@/lib/types";
import {
  ShoppingListItemsDelete,
  shoppingListItemsDeleteSchema,
} from "@/lib/schemas/shopping-list";
import z from "zod";

// Local schemas
const idSchema = z.cuid2();

const itemIdsSchema = z.array(z.cuid2());

export async function deleteShoppingListItemsAction({
  listId,
  itemIds,
}: {
  listId: string;
  itemIds: z.infer<typeof itemIdsSchema>;
}): Promise<ActionResult<void, void>> {
  await requireUser();

  // Validate list ID
  const validatedListId = idSchema.safeParse(listId);
  if (!validatedListId.success) {
    return {
      success: false,
      message: "Ogiltigt list-ID. Vänligen kontakta supporten",
    };
  }

  // Validate input data
  const validated = itemIdsSchema.safeParse(itemIds);

  // Return errors if validation fails
  if (!validated.success) {
    return {
      success: false,
      message: "Ogiltiga ID:n. Vänligen kontakta supporten",
    };
  }

  const deleteResult = await deleteShoppingListItems({
    listId: validatedListId.data,
    itemIds: validated.data,
  });

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
