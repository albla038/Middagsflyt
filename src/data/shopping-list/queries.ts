import "server-only";

import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";
import { ShoppingList } from "@/lib/generated/prisma";
import { ShoppingListResponse } from "@/lib/schemas/shopping-list";

export async function fetchAllShoppingLists(): Promise<ShoppingList[]> {
  const user = await requireUser();

  try {
    return await prisma.shoppingList.findMany({
      where: {
        household: {
          members: {
            some: { userId: user.id },
          },
        },
      },
    });
  } catch (error) {
    throw new Error(
      "Något gick fel när inköpslistorna skulle hämtas. Vänligen försök igen.",
      {
        cause: error instanceof Error ? error : Error(String(error)),
      },
    );
  }
}

export async function fetchShoppingList(
  listId: string,
): Promise<ShoppingListResponse | null> {
  const user = await requireUser();

  try {
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
        name: true,

        items: {
          orderBy: { createdAt: "desc" },

          // TODO Add relations
          // include: {},
        },
      },
    });

    return list;
  } catch (error) {
    throw new Error(
      "Något gick fel när inköpslistan skulle hämtas. Vänligen försök igen.",
      {
        cause: error instanceof Error ? error : Error(String(error)),
      },
    );
  }
}
