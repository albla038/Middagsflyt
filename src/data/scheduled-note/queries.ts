import "server-only";

import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";
import { ScheduledNoteDisplayContent } from "@/lib/types";

export async function fetchScheduledNotesByDateRange(
  scheduleId: string,
  startDate: Date,
  endDate: Date,
): Promise<ScheduledNoteDisplayContent[]> {
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

      select: {
        id: true,
        date: true,
        title: true,
        text: true,
        createdAt: true,
        updatedAt: true,

        createdBy: {
          select: {
            name: true,
            email: true,
          },
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
