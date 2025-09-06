import "server-only";

import { requireUser } from "@/data/user/verify-user";
import { Result } from "@/lib/types";
import prisma from "@/lib/db";
import { ShoppingListItem } from "@/lib/generated/prisma";
import {
  ShoppingListItemCreate,
  ShoppingListItemUpdate,
} from "@/lib/schemas/shopping-list";

// Create function to be used ONLY in route handler for user requests
export async function createShoppingListItem({
  listId,
  data,
}: {
  listId: string;
  data: ShoppingListItemCreate;
}): Promise<Result<ShoppingListItem, Error>> {
  const user = await requireUser();

  try {
    // Assure the shopping list exists and belongs to the user's household
    const list = await prisma.shoppingList.findUnique({
      where: {
        id: listId,

        household: {
          members: {
            some: { userId: user.id },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!list) {
      return {
        ok: false,
        error: new Error(
          "Du har inte behörighet att lägga till varor i denna lista.",
        ),
      };
    }

    const result = await prisma.shoppingListItem.create({
      data: {
        ...data,
        isManuallyEdited: true,

        shoppingList: {
          connect: { id: listId },
        },
      },
    });

    return { ok: true, data: result };
  } catch (error) {
    return {
      ok: false,
      error: new Error(
        "Något gick fel när ny varan skulle skapas. Vänligen försök igen.",
        { cause: error instanceof Error ? error : Error(String(error)) },
      ),
    };
  }
}

// Update function to be used ONLY in route handler for user requests
export async function updateShoppingListItem({
  listId,
  itemId,
  data,
}: {
  listId: string;
  itemId: string;
  data: ShoppingListItemUpdate;
}): Promise<Result<ShoppingListItem, Error>> {
  const user = await requireUser();

  try {
    const result = await prisma.shoppingListItem.update({
      where: {
        id: itemId,

        shoppingList: {
          id: listId,

          household: {
            members: {
              some: { userId: user.id },
            },
          },
        },
      },

      data: {
        ...data,
        isManuallyEdited: true,
      },
    });

    return { ok: true, data: result };
  } catch (error) {
    return {
      ok: false,
      error: new Error(
        "Något gick fel när varan skulle uppdateras. Vänligen försök igen.",
        { cause: error instanceof Error ? error : Error(String(error)) },
      ),
    };
  }
}
