import { createDefaultHousehold } from "@/data/household/mutations";
import prisma from "@/lib/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite", // TODO Change to "postgresql" when deploying DB
  }),

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await createDefaultHousehold(user);
        },
      },
    },
  },
});
