import "server-only";

import prisma from "@/lib/db";
import { Ingredient } from "@/lib/generated/prisma";
import { IngredientWithAlias } from "@/lib/types";

export async function fetchMissingIngredients(
  ingredientList: string[],
): Promise<string[]> {
  try {
    const existing = await prisma.ingredient.findMany({
      where: {
        name: { in: ingredientList },
      },
      select: {
        name: true,
      },
    });

    const aliases = await prisma.ingredientAlias.findMany({
      where: {
        name: { in: ingredientList },
      },
      select: {
        name: true,
      },
    });

    const existingNames = new Set([
      ...existing.map((record) => record.name),
      ...aliases.map((record) => record.name),
    ]);

    // If there are no existing ingredients, return the full list
    if (existingNames.size === 0) return ingredientList;

    const ingredientNames = new Set(ingredientList);
    const missingNames = ingredientNames.difference(existingNames);

    return [...missingNames];
  } catch (error) {
    throw new Error("Failed to fetch missing ingredients", {
      cause: error instanceof Error ? error : new Error(String(error)),
    });
  }
}

export async function fetchAllIngredientsWithAlias(): Promise<IngredientWithAlias[]> {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        displayNameSingular: true,
        displayNamePlural: true,
        shoppingUnit: true,
        ingredientCategoryId: true,

        ingredientAliases: {
          select: {
            name: true,
          },
        },
      },
    });

    return ingredients;
  } catch (error) {
    throw new Error("Failed to fetch ingredients", {
      cause: error instanceof Error ? error : new Error(String(error)),
    });
  }
}
