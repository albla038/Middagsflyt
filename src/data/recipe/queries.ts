import "server-only";

import { ProteinType, Recipe } from "@/lib/generated/prisma";
import prisma from "@/lib/db";
import { requireUser } from "@/data/user/verify-user";

// HELPER FUNCTIONS
function searchFilters(searchQuery: string) {
  const proteinTypeQueries: ProteinType[] = searchQuery
    .split(" ")
    .map((word) => word.toUpperCase())
    .filter((word): word is ProteinType => word in ProteinType);

  return [
    // Search by recipe name / title
    {
      name: {
        contains: searchQuery,
        // mode: "insensitive", // TODO Add for Postgres
      },
    },

    // Description search sometimes leads to akward results
    // {
    //   description: {
    //     contains: searchQuery,
    //     // mode: "insensitive", // TODO Add for Postgres
    //   },
    // },

    // Search by recipe ingredient text or ingredient name
    {
      recipeIngredients: {
        some: {
          OR: [
            {
              text: { contains: searchQuery },
            },
            {
              ingredient: {
                name: { contains: searchQuery },
              },
            },
          ],
        },
      },
    },

    // Search by protein type
    {
      proteinType: {
        in: proteinTypeQueries,
      },
    },
  ];
}

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

export async function fetchRecipeNameBySlug(slug: string) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { slug },
      select: {
        name: true,
      },
    });
    return recipe ? recipe.name : null;
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

export async function fetchAllSavedRecipes(searchQuery: string) {
  const user = await requireUser();

  try {
    return await prisma.recipe.findMany({
      where: {
        savedBy: {
          some: { userId: user.id },
        },
        OR: searchFilters(searchQuery),
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        slug: true,
        name: true,
        imageUrl: true,
        proteinType: true,
        totalTimeSeconds: true,
        recipeYield: true,
      },
    });
  } catch (error) {
    throw new Error(
      "Något gick fel när Mina recept hämtades, vänligen försök igen!",
      { cause: error instanceof Error ? Error : new Error(String(error)) },
    );
  }
}

export async function fetchAllCreatedRecipes(searchQuery: string) {
  const user = await requireUser();

  try {
    return await prisma.recipe.findMany({
      where: {
        createdById: user.id,
        OR: searchFilters(searchQuery),
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        slug: true,
        name: true,
        imageUrl: true,
        proteinType: true,
        totalTimeSeconds: true,
        recipeYield: true,
      },
    });
  } catch (error) {
    throw new Error(
      "Något gick fel när Mina recept hämtades, vänligen försök igen!",
      { cause: error instanceof Error ? Error : new Error(String(error)) },
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
