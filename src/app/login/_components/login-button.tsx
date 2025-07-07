"use client";

import { Button } from "@/components/ui/button";

import GoogleLogo from "@/components/ui/logo/google-logo";
import { authClient } from "@/lib/auth-client";
import { LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function LogInButton() {
  const [logInPending, startLogInTransition] = useTransition();

  async function signInWithGoogle() {
    startLogInTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.loading("Inloggningen lyckades. Omdirigering pågår...");
          },
          onError: () => {
            toast.error("Inloggning misslyckades: Internt serverfel");
          },
        },
      });
    });
  }

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={signInWithGoogle}
      disabled={logInPending}
    >
      {logInPending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" />
          <span>Loggar in...</span>
        </>
      ) : (
        <>
          <GoogleLogo />
          <span>Logga in med Google</span>
        </>
      )}
    </Button>
  );
}
