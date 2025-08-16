import "server-only";

import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";

export async function fetchScheduledRecipesByDateRange(
  scheduleId: string,
  startDate: Date,
  endDate: Date,
) {
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

      include: {
        recipe: true,
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
