import "server-only";

import prisma from "@/lib/db";

export async function fetchIngredientCategories(): Promise<string[]> {
  try {
    const data = await prisma.ingredientCategory.findMany({
      select: {
        name: true,
      },
    });

    return data.map(({ name }) => name);
  } catch (error) {
    throw new Error("Failed to fetch ingredient categories", {
      cause: error instanceof Error ? error : new Error(String(error)),
    });
  }
}
