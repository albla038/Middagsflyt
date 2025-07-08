import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";

export const verifyUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session.user;
});
