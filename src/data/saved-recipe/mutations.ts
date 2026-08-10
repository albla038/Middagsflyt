import "server-only";

import { requireHouseholdId } from "@/data/household/queries";
import prisma from "@/lib/db";
import { MutationResult } from "@/lib/types/api";
import { prismaErrorToErrorCode } from "@/lib/prisma-error-mapper";

export async function saveRecipe(recipeId: string): Promise<MutationResult> {
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

    return { ok: true };
  } catch (error) {
    return { ok: false, errorCode: prismaErrorToErrorCode(error) };
  }
}

export async function unsaveRecipe(recipeId: string): Promise<MutationResult> {
  try {
    const householdId = await requireHouseholdId();

    // Idempotent delete
    await prisma.savedRecipe.deleteMany({
      where: { householdId, recipeId },
    });

    return { ok: true };
  } catch (error) {
    return { ok: false, errorCode: prismaErrorToErrorCode(error) };
  }
}
