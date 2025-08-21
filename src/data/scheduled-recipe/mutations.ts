import "server-only";

import { Result } from "@/lib/types";
import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";

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
