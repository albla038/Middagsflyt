import "server-only";

import { requireHouseholdId } from "@/data/household/queries";
import prisma from "@/lib/db";
import { Result } from "@/lib/types";

export async function saveRecipe(
  recipeId: string,
): Promise<Result<void, Error>> {
  try {
    const householdId = await requireHouseholdId();

    // Idempotent create
    await prisma.savedRecipe.upsert({
      where: {
        householdId_recipeId: { householdId, recipeId },
      },
      create: {
        householdId,
        recipeId,
      },
      update: {},
    });

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: new Error("Failed to save recipe", {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}

export async function unsaveRecipe(
  recipeId: string,
): Promise<Result<void, Error>> {
  try {
    const householdId = await requireHouseholdId();

    // Idempotent delete
    await prisma.savedRecipe.deleteMany({
      where: { householdId, recipeId },
    });

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: new Error("Failed to remove recipe from saved recipes", {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}
