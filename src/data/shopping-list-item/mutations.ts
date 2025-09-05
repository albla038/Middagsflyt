import "server-only";

import { requireUser } from "@/data/user/verify-user";
import { Result } from "@/lib/types";
import prisma from "@/lib/db";
import { Prisma, ShoppingListItem } from "@/lib/generated/prisma";

export async function updateShoppingListItem({
  listId,
  itemId,
  data,
}: {
  listId: string;
  itemId: string;
  data: Prisma.ShoppingListItemUpdateInput;
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

      data,
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
