import "server-only";

import { requireUser } from "@/data/user/verify-user";
import { Result } from "@/lib/types";
import prisma from "@/lib/db";
import { Prisma, ShoppingListItem } from "@/lib/generated/prisma";
import {
  ShoppingListItemCreate,
  ShoppingListItemsRestore,
  ShoppingListItemUpdate,
} from "@/lib/schemas/shopping-list";

// TODO: Replace swedish error messages with english

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
    return await prisma.$transaction(async (tx) => {
      // Assure the shopping list exists and belongs to the user's household
      const list = await tx.shoppingList.findUnique({
        where: {
          id: listId,
          household: {
            members: {
              some: { userId: user.id },
            },
          },
        },

        select: {
          // Fetch the items relation, but only the last one
          items: {
            orderBy: { displayOrder: "desc" },
            take: 1,
            select: { displayOrder: true },
          },
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

      // Get largest displayOrder value if possible
      const lastItem = list.items.at(0);
      const newDisplayOrder = (lastItem?.displayOrder ?? 0) + 1000;

      const result = await tx.shoppingListItem.create({
        data: {
          id: data.id,
          name: data.name,
          quantity: data.quantity,
          unit: data.unit,
          displayOrder: newDisplayOrder,
          isManuallyEdited: true,

          shoppingList: {
            connect: { id: listId },
          },
          category: {
            connect: data.categoryId ? { id: data.categoryId } : undefined,
          },
        },
      });

      return { ok: true, data: result };
    });
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

export async function deleteShoppingListItem({
  listId,
  itemId,
}: {
  listId: string;
  itemId: string;
}): Promise<Result<ShoppingListItem, Error>> {
  const user = await requireUser();

  try {
    const result = await prisma.shoppingListItem.delete({
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
    });

    return { ok: true, data: result };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        ok: false,
        error: new Error("Varan du försöker radera finns inte.", {
          cause: error,
        }),
      };
    }

    return {
      ok: false,
      error: new Error(
        "Något gick fel när varan skulle raderas. Vänligen försök igen.",
        { cause: error instanceof Error ? error : Error(String(error)) },
      ),
    };
  }
}

export async function deleteShoppingListItems({
  listId,
  itemIds,
}: {
  listId: string;
  itemIds: string[];
}): Promise<Result<void, Error>> {
  const user = await requireUser();

  try {
    await prisma.shoppingListItem.deleteMany({
      where: {
        shoppingList: {
          id: listId,
          // Ensure the shopping list belongs to the user's household
          household: {
            members: {
              some: { userId: user.id },
            },
          },
        },

        id: { in: itemIds },
      },
    });

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: new Error("Failed to delete shopping list items.", {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}

export async function restoreShoppingListItems({
  listId,
  data,
}: {
  listId: string;
  data: ShoppingListItemsRestore;
}): Promise<Result<void, Error>> {
  const user = await requireUser();

  try {
    await prisma.$transaction(async (tx) => {
      // Verify the shopping list exists and belongs to the user's household
      const list = await tx.shoppingList.findFirst({
        where: {
          id: listId,
          household: {
            members: {
              some: { userId: user.id },
            },
          },
        },
      });

      if (!list) {
        return {
          ok: false,
          // TODO: Check error message propagation
          error: new Error(
            "The shopping list does not exist or you do not have permission to restore items.",
          ),
        };
      }

      // Restore items
      await tx.shoppingListItem.createMany({
        data: data.map((item) => ({
          ...item,
          shoppingListId: listId,
        })),
      });
    });

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: new Error("Failed to restore shopping list items.", {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}
