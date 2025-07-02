import "server-only";

import { Recipe } from "@/lib/generated/prisma";
import prisma from "@/lib/db";

// TODO Authenticate user in private queries

export async function fetchAllRecipes(): Promise<Recipe[]> {
  try {
    return await prisma.recipe.findMany({
      include: {
        recipeIngredients: {
          include: {
            ingredient: true,
          },
          orderBy: {
            displayOrder: "asc",
          },
        },
        recipeInstructions: {
          include: {
            recipeIngredients: {
              select: {
                displayOrder: true,
                text: true,
              },
            },
          },
          orderBy: {
            step: "asc",
          },
        },
      },
    });
  } catch (error) {
    throw new Error(
      "Något gick fel när recepten hämtades, vänligen försök igen!",
      { cause: error instanceof Error ? error : new Error(String(error)) },
    );
  }
}

export async function checkIfRecipeExistsByUrl(
  sourceUrl: string,
): Promise<boolean> {
  try {
    const exists = await prisma.recipe.findFirst({
      where: {
        sourceUrl: {
          equals: sourceUrl,
        },
      },
    });
    return !!exists;
  } catch (error) {
    throw new Error("Något gick fel, vänligen försök igen!", {
      cause: error instanceof Error ? error : new Error(String(error)),
    });
  }
}
