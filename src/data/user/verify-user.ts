import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import { User } from "better-auth";

export const verifyUser = cache(async (): Promise<User | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return session.user;
});

export async function requireUser(): Promise<User> {
  const user = await verifyUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
