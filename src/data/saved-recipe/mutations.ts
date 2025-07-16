import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";
import { Result } from "@/lib/types";

export async function saveRecipe(
  recipeId: string,
): Promise<Result<void, Error>> {
  const user = await requireUser();

  try {
    // Idempotent create
    await prisma.savedRecipe.upsert({
      where: {
        userId_recipeId: { recipeId, userId: user.id },
      },
      create: { recipeId, userId: user.id },
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
  const user = await requireUser();

  try {
    // Idempotent delete
    await prisma.savedRecipe.deleteMany({
      where: { recipeId, userId: user.id },
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
