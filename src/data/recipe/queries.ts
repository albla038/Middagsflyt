import "server-only";

import { ProteinType } from "@/lib/generated/prisma";
import prisma from "@/lib/db";
import { requireUser } from "@/data/user/verify-user";
import { Order, SortBy } from "@/lib/types";
import { RecipeDisplayContent } from "@/lib/schemas/recipe";
import { startOfToday } from "date-fns";
import { Prisma } from "@/lib/generated/prisma/client";
import { Recipe } from "@/lib/types/recipe";

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

    // Description search sometimes leads to awkward results
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

export const recipeSelects = {
  id: true,
  slug: true,
  name: true,
  description: true,
  recipeYield: true,
  imageUrl: true,

  recipeType: true,
  proteinType: true,

  totalTimeSeconds: true,
  oven: true,

  originalAuthor: true,
  sourceUrl: true,
  isImported: true,

  createdAt: true,
  updatedAt: true,

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
      id: true,
      name: true,
      image: true,
      email: true,
    },
  },
} satisfies Prisma.RecipeSelect;

export async function fetchRecipeBySlug(slug: string): Promise<Recipe | null> {
  const recipe = await prisma.recipe.findUnique({
    where: { slug },
    select: recipeSelects,
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

export async function fetchRecipeForUserBySlug(
  slug: string,
): Promise<(Recipe & { isSaved: boolean }) | null> {
  const user = await requireUser();

  const recipe = await prisma.recipe.findUnique({
    where: { slug },
    select: {
      ...recipeSelects,

      _count: {
        select: {
          savedBy: {
            where: {
              household: {
                members: {
                  some: { userId: user.id },
                },
              },
            },
          },
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

  const { _count, ...rest } = recipe;

  return {
    ...rest,
    isSaved: _count.savedBy > 0,
    recipeInstructions: transformedInstructions,
  };
}

export async function fetchAllRecipesForUser(
  searchQuery: string,
  order: "asc" | "desc" = "desc",
  sortBy: "createdAt" | "name" = "createdAt",
): Promise<RecipeDisplayContent[]> {
  const user = await requireUser();

  const data = await prisma.recipe.findMany({
    where: {
      OR: searchFilters(searchQuery),
    },
    orderBy: {
      [sortBy]: order,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      imageUrl: true,
      recipeType: true,
      proteinType: true,
      totalTimeSeconds: true,
      recipeYield: true,
      isImported: true,
      createdById: true,
      _count: {
        select: {
          savedBy: {
            where: {
              household: {
                members: {
                  some: { userId: user.id },
                },
              },
            },
          },
        },
      },
    },
  });

  return data.map((recipe) => {
    const { _count, createdById, ...rest } = recipe;
    return {
      ...rest,
      isSaved: _count.savedBy > 0,
      isCreatedByUser: createdById === user.id,
    };
  });
}

export async function fetchRecipesCount(searchQuery: string) {
  const count = await prisma.recipe.count({
    where: {
      OR: searchFilters(searchQuery),
    },
  });

  return count;
}

export async function fetchAllSavedRecipes(
  searchQuery: string,
  order: Order = "desc",
  sort: SortBy = "createdAt",
): Promise<RecipeDisplayContent[]> {
  const user = await requireUser();

  function sortBy(sort: SortBy, order: Order) {
    if (sort === "createdAt") {
      return {
        savedAt: order,
      };
    } else {
      return {
        recipe: {
          name: order,
        },
      };
    }
  }

  try {
    const data = await prisma.savedRecipe.findMany({
      where: {
        household: {
          members: {
            some: { userId: user.id },
          },
        },
        recipe: {
          OR: searchFilters(searchQuery),
        },
      },
      orderBy: sortBy(sort, order),
      select: {
        recipe: {
          select: {
            id: true,
            slug: true,
            name: true,
            imageUrl: true,
            recipeType: true,
            proteinType: true,
            totalTimeSeconds: true,
            recipeYield: true,
            isImported: true,
            createdById: true,

            schedules: {
              where: {
                date: {
                  gte: startOfToday(),
                },
              },
              select: {
                date: true,
              },
            },
          },
        },
      },
    });

    return data.map((item) => {
      const { recipe } = item;
      const { createdById, schedules, ...rest } = recipe;

      return {
        ...rest,
        isSaved: true,
        isCreatedByUser: createdById === user.id,
        scheduledDates: schedules.map(
          (scheduledRecipe) => scheduledRecipe.date,
        ),
      };
    });
  } catch (error) {
    throw new Error(
      "Något gick fel när sparade recept hämtades, vänligen försök igen!",
      { cause: error instanceof Error ? Error : new Error(String(error)) },
    );
  }
}

export async function fetchAllCreatedRecipes(
  searchQuery: string,
  order: "asc" | "desc" = "desc",
  sortBy: "createdAt" | "name" = "createdAt",
): Promise<RecipeDisplayContent[]> {
  const user = await requireUser();

  try {
    const data = await prisma.recipe.findMany({
      where: {
        createdById: user.id,
        OR: searchFilters(searchQuery),
      },
      orderBy: {
        [sortBy]: order,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        imageUrl: true,
        recipeType: true,
        proteinType: true,
        totalTimeSeconds: true,
        recipeYield: true,
        isImported: true,
        createdById: true,
        // Get count only to determine if the recipe is saved by the user
        _count: {
          select: {
            savedBy: {
              where: {
                household: {
                  members: {
                    some: { userId: user.id },
                  },
                },
              },
            },
          },
        },
      },
    });

    return data.map((recipe) => {
      const { _count, createdById, ...rest } = recipe;
      return {
        ...rest,
        isSaved: _count.savedBy > 0,
        isCreatedByUser: createdById === user.id,
      };
    });
  } catch (error) {
    throw new Error(
      "Något gick fel när importerade/skapade recept hämtades, vänligen försök igen!",
      { cause: error instanceof Error ? Error : new Error(String(error)) },
    );
  }
}

export async function getSavedRecipesCount(
  searchQuery: string = "",
): Promise<number> {
  const user = await requireUser();

  try {
    return await prisma.recipe.count({
      where: {
        savedBy: {
          some: {
            household: {
              members: {
                some: { userId: user.id },
              },
            },
          },
        },
        OR: searchFilters(searchQuery),
      },
    });
  } catch (error) {
    throw new Error(
      "Något gick fel när sparade recept räknades, vänligt försök igen!",
      { cause: error instanceof Error ? error : new Error(String(error)) },
    );
  }
}

export async function getCreatedRecipesCount(
  searchQuery: string = "",
): Promise<number> {
  const user = await requireUser();

  try {
    return await prisma.recipe.count({
      where: {
        createdById: user.id,
        OR: searchFilters(searchQuery),
      },
    });
  } catch (error) {
    throw new Error(
      "Något gick fel när importerade/skapade recept räknades, vänligt försök igen!",
      { cause: error instanceof Error ? error : new Error(String(error)) },
    );
  }
}

export async function findRecipeSlugByUrl(
  sourceUrl: string,
): Promise<string | false> {
  try {
    const recipe = await prisma.recipe.findFirst({
      where: {
        sourceUrl: {
          equals: sourceUrl,
        },
      },
      select: {
        slug: true,
      },
    });

    if (recipe) {
      return recipe.slug;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error("Något gick fel, vänligen försök igen!", {
      cause: error instanceof Error ? error : new Error(String(error)),
    });
  }
}
