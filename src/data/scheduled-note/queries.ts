import "server-only";

import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";

export async function fetchScheduledNotesByDateRange(
  scheduleId: string,
  startDate: Date,
  endDate: Date,
) {
  const user = await requireUser();

  try {
    return await prisma.scheduledNote.findMany({
      where: {
        schedule: {
          id: scheduleId,
          household: {
            members: {
              some: { userId: user.id },
            },
          },
        },

        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  } catch (error) {
    throw new Error(
      "Något gick fel när schemalagda anteckningar hämtades, vänligen försök igen!",
      {
        cause: error instanceof Error ? error : new Error(String(error)),
      },
    );
  }
}
