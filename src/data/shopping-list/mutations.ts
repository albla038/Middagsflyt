import "server-only";

import { requireHouseholdId } from "@/data/household/queries";
import prisma from "@/lib/db";
import { requireUser } from "@/data/user/verify-user";
import { MutationResult } from "@/lib/types/api";
import { prismaErrorToMutationErrorCode } from "@/lib/prisma-error-mapper";

export async function createShoppingList(
  name: string,
): Promise<MutationResult> {
  const householdId = await requireHouseholdId();

  try {
    await prisma.shoppingList.create({
      data: {
        name,
        householdId,
      },
    });

    return { ok: true };
  } catch (error) {
    const errorCode = prismaErrorToMutationErrorCode(error);

    return { ok: false, errorCode };
  }
}

export async function updateShoppingList({
  listId,
  name,
}: {
  listId: string;
  name: string;
}): Promise<MutationResult> {
  const user = await requireUser();

  try {
    await prisma.shoppingList.update({
      data: {
        name,
      },
      where: {
        id: listId,

        // Ensure the list belongs to the user's household
        household: {
          members: {
            some: { userId: user.id },
          },
        },
      },
    });

    return { ok: true };
  } catch (error) {
    const errorCode = prismaErrorToMutationErrorCode(error);

    return { ok: false, errorCode };
  }
}

export async function deleteShoppingList(
  listId: string,
): Promise<MutationResult> {
  const user = await requireUser();

  try {
    await prisma.shoppingList.delete({
      where: {
        id: listId,

        // Ensure the list belongs to the user's household
        household: {
          members: {
            some: { userId: user.id },
          },
        },
      },
    });

    return { ok: true };
  } catch (error) {
    const errorCode = prismaErrorToMutationErrorCode(error);

    return { ok: false, errorCode };
  }
}
