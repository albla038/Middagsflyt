import "server-only";

import prisma from "@/lib/db";
import { User } from "better-auth";

export async function createDefaultHousehold(user: User): Promise<void> {
  const firstName = user.name.split(" ")[0];

  try {
    await prisma.household.create({
      data: {
        name: `${firstName}s hushåll`,
        members: {
          create: {
            userId: user.id,
          },
        },
        schedules: {
          create: {
            name: "Matsedel",
          },
        },
      },
    });
  } catch (error) {
    throw new Error("Failed to create default household", {
      cause: error instanceof Error ? error : new Error(String(error)),
    });
  }
}
