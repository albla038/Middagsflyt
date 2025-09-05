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

        items: true,

        //     // TODO Add relations when needed
        //     // ingredient: {
        //     //   select: {}
        //     // },
        //     // category: {
        //     //   select: { id: true, name: true },
        //     // },
        //     // sources: {
        //     //   select: {},
        //     // },
        //   },
        // },
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
