import "server-only";

import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";
import { ScheduledRecipeDisplayContent } from "@/lib/types";
import { recipeSelects } from "@/data/recipe/queries";
import { Recipe } from "@/lib/types/recipe";

export async function fetchScheduledRecipe(id: string): Promise<{
  id: string;
  date: Date;
  servings: number | null;
  schedule: {
    id: string;
    name: string;
  };
  recipe: Recipe & { isSaved: boolean };
} | null> {
  const user = await requireUser();

  const scheduledRecipe = await prisma.scheduledRecipe.findUnique({
    where: {
      id,

      schedule: {
        household: {
          members: {
            some: { userId: user.id },
          },
        },
      },
    },

    select: {
      id: true,
      date: true,
      servings: true,

      schedule: {
        select: { id: true, name: true },
      },

      recipe: {
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
      },
    },
  });

  if (!scheduledRecipe) return null;

  // Transform the nested recipeIngredients to be a string array
  const transformedInstructions = scheduledRecipe.recipe.recipeInstructions.map(
    (instruction) => ({
      ...instruction,
      recipeIngredients: instruction.recipeIngredients.map((ing) => ing.id),
    }),
  );

  const { recipe, ...rest } = scheduledRecipe;
  const { _count, ...recipeRest } = recipe;

  return {
    ...rest,
    recipe: {
      ...recipeRest,
      isSaved: _count.savedBy > 0,
      recipeInstructions: transformedInstructions,
    },
  };
}

export async function fetchScheduledRecipesByDateRange(
  scheduleId: string,
  startDate: Date,
  endDate: Date,
): Promise<ScheduledRecipeDisplayContent[]> {
  const user = await requireUser();

  try {
    return await prisma.scheduledRecipe.findMany({
      where: {
        schedule: {
          id: scheduleId,
          household: {
            members: {
              some: { userId: user.id },
            },
          },
        },

        // Filter by date range
        date: {
          gte: startDate,
          lte: endDate,
        },
      },

      select: {
        id: true,
        date: true,
        servings: true,
        note: true,
        createdAt: true,
        updatedAt: true,

        recipe: {
          select: {
            id: true,
            slug: true,
            name: true,
            recipeType: true,
            proteinType: true,
            totalTimeSeconds: true,
          },
        },

        assignee: true,
      },
    });
  } catch (error) {
    throw new Error(
      "Något gick fel när schemalagda recept hämtades, vänligen försök igen!",
      {
        cause: error instanceof Error ? error : new Error(String(error)),
      },
    );
  }
}
