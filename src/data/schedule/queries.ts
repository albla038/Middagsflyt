import "server-only";

import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";
import { Schedule } from "@/lib/generated/prisma";
import { ScheduleWithMembers } from "@/lib/schemas/schedule";

export async function fetchAllSchedules(): Promise<Schedule[]> {
  const user = await requireUser();

  const schedules = await prisma.schedule.findMany({
    where: {
      household: {
        members: {
          some: { userId: user.id },
        },
      },
    },
  });

  return schedules;
}

export async function fetchAllSchedulesWithMembers(): Promise<
  ScheduleWithMembers[]
> {
  const user = await requireUser();

  const schedules = await prisma.schedule.findMany({
    where: {
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

      createdAt: true,
      updatedAt: true,
    },
  });

  const transformedData = schedules.map(({ household, ...rest }) => ({
    ...rest,
    members: household.members,
  }));

  return transformedData;
}

export async function fetchScheduleAndMembersById(
  scheduleId: string,
): Promise<ScheduleWithMembers | null> {
  const user = await requireUser();

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

      createdAt: true,
      updatedAt: true,
    },
  });

  if (!schedule) {
    return null;
  }

  const { household, ...rest } = schedule;
  return { ...rest, members: household.members };
}
