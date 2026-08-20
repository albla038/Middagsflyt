import "server-only";

import prisma from "@/lib/db";
import { IngredientWithAlias } from "@/lib/types";

export async function fetchMissingIngredients(
  ingredientList: string[],
): Promise<string[]> {
  // Fetch existing ingredient names
  const names = await prisma.ingredient.findMany({
    where: {
      name: { in: ingredientList },
    },
    select: { name: true },
  });

  // Fetch existing ingredient aliases
  const aliases = await prisma.ingredientAlias.findMany({
    where: {
      name: { in: ingredientList },
    },
    select: { name: true },
  });

  // Merge the names and aliases into a single set of existing names
  const existingNames = new Set([
    ...names.map((record) => record.name),
    ...aliases.map((record) => record.name),
  ]);

  // If there are no existing ingredients, return the full list
  if (existingNames.size === 0) return ingredientList;

  // The difference between the ingredientList and existingNames will give us the missing ingredients
  const missingNames = existingNames.difference(new Set(ingredientList));

  return [...missingNames];
}

export async function fetchAllIngredientsWithAlias(): Promise<
  IngredientWithAlias[]
> {
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
}
