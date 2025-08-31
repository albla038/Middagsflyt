import "server-only";

import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";
import { ShoppingListResponse } from "@/lib/schemas/shopping-list";

export async function fetchShoppingList(
  listId: string,
): Promise<ShoppingListResponse | null> {
  const user = await requireUser();

  try {
    return await prisma.shoppingList.findUnique({
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
        name: true,
        items: {
          select: {
            id: true,
            name: true,
            quantity: true,
            unit: true,
            displayOrder: true,
            isPurchased: true,
            isManuallyEdited: true,

            // TODO Add relations when needed
            // ingredient: {
            //   select: {}
            // },
            // category: {
            //   select: { id: true, name: true },
            // },
            // sources: {
            //   select: {},
            // },
          },
        },
      },
    });
  } catch (error) {
    throw new Error(
      "Något gick fel när inköpslistan skulle hämtas. Vänligen försök igen.",
      {
        cause: error instanceof Error ? error : Error(String(error)),
      },
    );
  }
}
