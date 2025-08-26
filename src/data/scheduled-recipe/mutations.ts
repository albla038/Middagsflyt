import "server-only";

import { Result } from "@/lib/types";
import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";

export async function createScheduledRecipe({
  scheduleId,
  recipeId,
  date,
  servings,
  assigneeId,
  note,
}: {
  scheduleId: string;
  recipeId: string;
  date: Date;
  servings: number;
  assigneeId: string | undefined;
  note: string | null;
}): Promise<Result<void, Error>> {
  const user = await requireUser();

  try {
    await prisma.scheduledRecipe.create({
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
        recipe: {
          connect: { id: recipeId },
        },
        assignee: assigneeId
          ? {
              connect: { id: assigneeId },
            }
          : undefined,

        date,
        servings,
        note,
      },
    });

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: new Error("Failed to create scheduled recipe", {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}

export async function updateScheduledRecipeAssignee({
  scheduledRecipeId,
  assigneeId,
}: {
  scheduledRecipeId: string;
  assigneeId: string | null;
}): Promise<Result<void, Error>> {
  const user = await requireUser();

  try {
    await prisma.scheduledRecipe.update({
      where: {
        id: scheduledRecipeId,
        schedule: {
          household: {
            members: {
              some: { userId: user.id },
            },
          },
        },
      },

      data: {
        assignee: assigneeId
          ? { connect: { id: assigneeId } }
          : { disconnect: true },
      },
    });
    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: new Error("Failed to update scheduled recipe assignee", {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}

export async function updateScheduledRecipeDate(
  scheduledRecipeId: string,
  newDate: Date,
): Promise<Result<void, Error>> {
  const user = await requireUser();

  try {
    await prisma.scheduledRecipe.update({
      where: {
        id: scheduledRecipeId,
        schedule: {
          household: {
            members: {
              some: { userId: user.id },
            },
          },
        },
      },

      data: {
        date: newDate,
      },
    });
    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: new Error("Failed to update scheduled recipe date", {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}

export async function deleteScheduledRecipe(
  scheduledRecipeId: string,
): Promise<Result<void, Error>> {
  const user = await requireUser();

  try {
    await prisma.scheduledRecipe.delete({
      where: {
        id: scheduledRecipeId,

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
      error: new Error("Failed to delete scheduled recipe", {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}
