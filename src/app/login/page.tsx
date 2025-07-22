import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import LogInButton from "@/app/login/_components/login-button";
import { cn } from "@/lib/utils";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return (
    <Card
      className={cn(
        "overflow-clip border-none p-0",
        "sm:border sm:border-solid sm:border-border",
      )}
    >
      <CardContent className="grid gap-0 p-0 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center p-6 md:h-[512px]">
          <div className="grid gap-6">
            <div className="grid gap-1.5 text-center">
              <CardTitle className="text-2xl font-semibold">
                Välkommen tillbaka
              </CardTitle>
              <CardDescription className="px-4">
                Fortsätt med ditt Google-konto för att logga in
              </CardDescription>
            </div>

            <LogInButton />
          </div>
        </div>
        <div className="relative hidden md:block">
          <Image
            alt="Login image"
            src="/raggmunk-2.jpg"
            className="absolute inset-0 size-full object-cover"
            width="1000"
            height="1000"
          />
        </div>
      </CardContent>
    </Card>
  );
}
