import "server-only";

import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";
import { cache } from "react";

export const requireHouseholdId = cache(async (): Promise<string> => {
  const user = await requireUser();

  try {
    const membership = await prisma.householdMember.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        householdId: true,
      },
    });

    if (!membership) {
      throw new Error("User is not a member of any household.");
    }

    return membership.householdId;
  } catch (error) {
    throw new Error("Något gick fel, vänligen försök igen!", {
      cause: error instanceof Error ? error : new Error(String(error)),
    });
  }
});
