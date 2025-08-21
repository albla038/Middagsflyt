import "server-only";

import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";
import { ScheduledRecipeDisplayContent } from "@/lib/types";

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

        assignee: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
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
