import "server-only";

import { requireHouseholdId } from "@/data/household/queries";
import prisma from "@/lib/db";
import { Result } from "@/lib/types";
import { requireUser } from "@/data/user/verify-user";

export async function createSchedule(
  name: string,
  description?: string,
): Promise<Result<void, Error>> {
  try {
    const householdId = await requireHouseholdId();

    await prisma.schedule.create({
      data: {
        name,
        description,
        householdId,
      },
    });

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: new Error("Failed to create schedule", {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}

export async function deleteSchedule(
  scheduleId: string,
): Promise<Result<void, Error>> {
  const user = await requireUser();

  try {
    await prisma.schedule.delete({
      where: {
        household: {
          members: {
            some: { userId: user.id },
          },
        },
        id: scheduleId,
      },
    });

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: new Error(`Failed to delete schedule with ID: ${scheduleId}`, {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}

export async function renameSchedule({
  scheduleId,
  newName,
  description,
}: {
  scheduleId: string;
  newName: string;
  description?: string;
}): Promise<Result<string, Error>> {
  const user = await requireUser();

  try {
    const result = await prisma.schedule.update({
      where: {
        household: {
          members: {
            some: { userId: user.id },
          },
        },
        id: scheduleId,
      },
      data: {
        name: newName,
        description,
      },
      select: {
        name: true,
      },
    });

    return {
      ok: true,
      data: result.name,
    };
  } catch (error) {
    return {
      ok: false,
      error: new Error(`Failed to rename schedule with ID: ${scheduleId}`, {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}
