import "server-only";

import { Result } from "@/lib/types";
import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";
import { MutationResult } from "@/lib/types/api";
import { prismaErrorToErrorCode } from "@/lib/prisma-error-mapper";
import { ScheduleRecipeCreate } from "@/lib/schemas/scheduled-recipe";

export async function createScheduledRecipe({
  scheduleId,
  recipeId,
  date,
  servings,
  assigneeId,
  note,
}: ScheduleRecipeCreate): Promise<MutationResult> {
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

    return { ok: true };
  } catch (error) {
    return { ok: false, errorCode: prismaErrorToErrorCode(error) };
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

export async function updateScheduledRecipeNote(
  scheduledRecipeId: string,
  note: string | null,
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

      data: { note },
    });

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: new Error("Failed to update scheduled recipe note", {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}

export async function updateScheduledRecipesServings(
  updates: { id: string; servings: number }[],
): Promise<MutationResult> {
  const user = await requireUser();

  try {
    await prisma.$transaction(
      updates.map((update) =>
        prisma.scheduledRecipe.update({
          where: {
            id: update.id,

            // Ensure the scheduled recipe belongs to the user's household
            schedule: {
              household: {
                members: {
                  some: { userId: user.id },
                },
              },
            },
          },

          data: {
            servings: update.servings,
          },
        }),
      ),
    );

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      errorCode: prismaErrorToErrorCode(error),
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
