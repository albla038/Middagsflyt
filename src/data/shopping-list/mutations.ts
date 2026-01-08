import "server-only";

import { requireHouseholdId } from "@/data/household/queries";
import prisma from "@/lib/db";
import { Result } from "@/lib/types";
import { ShoppingList } from "@/lib/generated/prisma";
import { requireUser } from "@/data/user/verify-user";

export async function createShoppingList(
  name: string,
): Promise<Result<ShoppingList, Error>> {
  try {
    const householdId = await requireHouseholdId();

    const data = await prisma.shoppingList.create({
      data: {
        name,
        householdId,
      },
    });

    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: new Error("Failed to create shopping list", {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}

export async function updateShoppingList({
  listId,
  name,
}: {
  listId: string;
  name: string;
}): Promise<Result<ShoppingList, Error>> {
  try {
    const user = await requireUser();

    const data = await prisma.shoppingList.update({
      data: {
        name,
      },
      where: {
        id: listId,

        household: {
          members: {
            some: { userId: user.id },
          },
        },
      },
    });

    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: new Error("Failed to update shopping list", {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}
