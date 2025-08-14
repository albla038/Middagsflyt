import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";
import { Schedule } from "@/lib/generated/prisma";
import "server-only";

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
