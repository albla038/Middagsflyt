import "server-only";

import { requireUser } from "@/data/user/verify-user";
import { Result } from "@/lib/types";
import prisma from "@/lib/db";

export async function createScheduledNote({
  scheduleId,
  date,
  title,
  text,
}: {
  scheduleId: string;
  date: Date;
  title: string;
  text: string;
}): Promise<Result<void, Error>> {
  const user = await requireUser();

  try {
    await prisma.scheduledNote.create({
      data: {
        schedule: {
          // Ensure the schedule belongs to the user's household
          connect: {
            id: scheduleId,
            household: {
              members: {
                some: { userId: user.id },
              },
            },
          },
        },

        date,
        title,
        text,
      },
    });

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: new Error("Failed to create scheduled note", {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}

export async function updateScheduledNote({
  noteId,
  date,
  title,
  text,
}: {
  noteId: string;
  date?: Date;
  title?: string;
  text?: string;
}): Promise<Result<void, Error>> {
  const user = await requireUser();

  try {
    await prisma.scheduledNote.update({
      where: {
        id: noteId,

        // Ensure the schedule belongs to the user's household
        schedule: {
          household: {
            members: {
              some: { userId: user.id },
            },
          },
        },
      },

      data: {
        date,
        title,
        text,
      },
    });

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: new Error("Failed to update scheduled note", {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}

export async function deleteScheduledNote(
  noteId: string,
): Promise<Result<void, Error>> {
  const user = await requireUser();

  try {
    await prisma.scheduledNote.delete({
      where: {
        id: noteId,

        // Ensure the schedule belongs to the user's household
        schedule: {
          household: {
            members: {
              some: { userId: user.id },
            },
          },
        },
      },
    });

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: new Error("Failed to delete scheduled note", {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}
