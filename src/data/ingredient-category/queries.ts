import "server-only";

import prisma from "@/lib/db";

export async function fetchIngredientCategories(): Promise<
  { id: string; name: string }[]
> {
  try {
    return await prisma.ingredientCategory.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    throw new Error("Failed to fetch ingredient categories", {
      cause: error instanceof Error ? error : new Error(String(error)),
    });
  }
}

export async function fetchIngredientCategoryNames(): Promise<string[]> {
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
