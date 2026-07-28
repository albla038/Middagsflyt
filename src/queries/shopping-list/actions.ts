"use server";

import {
  createShoppingListItem,
  deleteShoppingListItems,
  restoreShoppingListItems,
} from "@/data/shopping-list-item/mutations";
import { requireUser } from "@/data/user/verify-user";
import { ActionResult } from "@/lib/types";
import {
  ShoppingListItemCreate,
  shoppingListItemCreateSchema,
  ShoppingListItemsRestore,
  shoppingListItemsRestoreSchema,
} from "@/lib/schemas/shopping-list";
import z from "zod";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/lib/types/api";

// Local schemas
const idSchema = z.cuid2();

const itemIdsSchema = z.array(z.cuid2());

export async function createShoppingListItemAction({
  listId,
  data,
}: {
  listId: string;
  data: ShoppingListItemCreate;
}): Promise<ActionResponse> {
  await requireUser();

  // Validate data
  const validatedListId = idSchema.safeParse(listId);
  const validated = shoppingListItemCreateSchema.safeParse(data);

  // Return error code if validation fails
  if (!validated.success || !validatedListId.success) {
    return { success: false, errorCode: "VALIDATION_FAILED" };
  }

  // Create the shopping list item
  const mutationResult = await createShoppingListItem({
    listId: validatedListId.data,
    data: validated.data,
  });

  // Return error code if mutation fails
  if (!mutationResult.ok) {
    return { success: false, errorCode: mutationResult.errorCode };
  }

  revalidatePath(`/shopping-list/${listId}`);

  return { success: true };
}

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

  revalidatePath(`/shopping-list/${listId}`);

  return {
    success: true,
    message: "Varorna togs bort",
  };
}

type RestoreItemsErrors =
  z.core.$ZodFlattenedError<ShoppingListItemsRestore>["fieldErrors"];

export async function restoreShoppingListItemsAction({
  listId,
  data,
}: {
  listId: string;
  data: ShoppingListItemsRestore;
}): Promise<ActionResult<void, RestoreItemsErrors>> {
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
  const validated = shoppingListItemsRestoreSchema.safeParse(data);

  // Return errors if validation fails
  if (!validated.success) {
    const { fieldErrors } = z.flattenError(validated.error);
    return {
      success: false,
      message: "Ogiltiga data. Vänligen kontakta supporten",
      errors: fieldErrors,
    };
  }

  // Restore items in database
  const restoreResult = await restoreShoppingListItems({
    listId: validatedListId.data,
    data: validated.data,
  });

  // Return error if restoration fails
  if (!restoreResult.ok) {
    return {
      success: false,
      message: "Något gick fel när varorna skulle återställas.",
    };
  }

  revalidatePath(`/shopping-list/${listId}`);

  return {
    success: true,
    message: "Varorna återställdes",
  };
}
