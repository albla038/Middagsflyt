import "server-only";

import { Recipe } from "@/lib/generated/prisma";
import prisma from "@/lib/db";

// TODO Authenticate user in private queries

export async function fetchRecipeBySlug(slug: string) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { slug },
      include: {
        // Relation for RecipeIngredient component
        recipeIngredients: {
          select: {
            id: true,
            text: true,
            note: true,
            quantity: true,
            unit: true,
          },
          orderBy: { displayOrder: "asc" },
        },

        // Relation for RecipeInstruction component
        recipeInstructions: {
          select: {
            id: true,
            text: true,
            step: true,
            recipeIngredients: {
              select: {
                id: true,
              },
            },
          },
          orderBy: { step: "asc" },
        },
        // Relation for createdBy HoverCard
        createdBy: {
          select: {
            name: true,
            image: true,
            email: true,
          },
        },
      },
    });

    if (!recipe) return null;

    // Transform the nested recipeIngredients to be a string array
    const transformedInstructions = recipe.recipeInstructions.map(
      (instruction) => ({
        ...instruction,
        recipeIngredients: instruction.recipeIngredients.map((ing) => ing.id),
      }),
    );

    return {
      ...recipe,
      recipeInstructions: transformedInstructions,
    };
  } catch (error) {
    throw new Error(
      "Något gick fel när receptet hämtades, vänligen försök igen!",
      {
        cause: error instanceof Error ? error : new Error(String(error)),
      },
    );
  }
}

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
