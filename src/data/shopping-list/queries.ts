import "server-only";

import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";
import {
  ShoppingListResponse,
  ShoppingListWithCount,
} from "@/lib/schemas/shopping-list";

export async function fetchAllShoppingLists(): Promise<
  ShoppingListWithCount[]
> {
  const user = await requireUser();

  const data = await prisma.shoppingList.findMany({
    where: {
      household: {
        members: {
          some: { userId: user.id },
        },
      },
    },

    include: {
      _count: {
        select: { items: true },
      },
    },
  });

  const transformedData = data.map(({ _count, ...list }) => ({
    ...list,
    itemCount: _count.items,
  }));

  return transformedData;
}

export async function fetchShoppingListMetrics(
  listId: string,
): Promise<ShoppingListWithCount | null> {
  const user = await requireUser();

  const list = await prisma.shoppingList.findUnique({
    where: {
      id: listId,

      household: {
        members: {
          some: { userId: user.id },
        },
      },
    },

    include: {
      _count: {
        select: { items: true },
      },
    },
  });

  if (!list) {
    return null;
  }

  // Transform the _count field to itemCount
  const { _count, ...rest } = list;
  return { ...rest, itemCount: _count.items };
}

export async function fetchShoppingList(
  listId: string,
): Promise<ShoppingListResponse | null> {
  const user = await requireUser();

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
      householdId: true,

      createdAt: true,
      updatedAt: true,

      items: {
        orderBy: { displayOrder: "desc" },

        select: {
          id: true,
          name: true,
          quantity: true,
          unit: true,
          displayOrder: true,
          isPurchased: true,
          isManuallyEdited: true,

          createdAt: true,
          updatedAt: true,

          categoryId: true,

          // Include the scheduledRecipe relation for each item
          scheduledRecipe: {
            select: {
              id: true,
              date: true,
              servings: true,
              note: true,

              recipe: {
                select: {
                  id: true,
                  slug: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
