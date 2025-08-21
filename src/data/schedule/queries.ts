import "server-only";

import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";
import { Schedule } from "@/lib/generated/prisma";
import { ScheduleWithMembers } from "@/lib/types";

export async function fetchAllSchedules(): Promise<Schedule[]> {
  const user = await requireUser();

  try {
    return await prisma.schedule.findMany({
      where: {
        household: {
          members: {
            some: { userId: user.id },
          },
        },
      },
    });
  } catch (error) {
    throw new Error(
      "Något gick fel när kalendrar hämtades, vänligen försök igen!",
      {
        cause: error instanceof Error ? error : new Error(String(error)),
      },
    );
  }
}

export async function fetchScheduleAndMembersById(
  scheduleId: string,
): Promise<ScheduleWithMembers | null> {
  const user = await requireUser();

  try {
    const schedule = await prisma.schedule.findUnique({
      where: {
        id: scheduleId,
        household: {
          members: {
            some: { userId: user.id },
          },
        },
      },

      select: {
        id: true,
        name: true,
        description: true,
        household: {
          select: {
            members: {
              select: {
                role: true,
                user: true,
              },
            },
          },
        },
      },
    });

    if (!schedule) {
      return null;
    }

    const { household, ...rest } = schedule;
    return { ...rest, members: household.members };
  } catch (error) {
    throw new Error(
      "Något gick fel när kalendern hämtades, vänligen försök igen!",
      {
        cause: error instanceof Error ? error : new Error(String(error)),
      },
    );
  }
}
