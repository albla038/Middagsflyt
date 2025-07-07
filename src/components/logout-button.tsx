"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function LogOutButton() {
  const [logOutPending, startLogOutTransition] = useTransition();
  const router = useRouter();

  async function logOut() {
    startLogOutTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
          },
          onError: () => {
            toast.error("Utloggningen misslyckades", {
              action: {
                label: "Försök igen",
                onClick: logOut,
              },
            });
          },
        },
      });
    });
  }

  return (
    <Button onClick={logOut} variant="outline" disabled={logOutPending}>
      {logOutPending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" />
          <span>Loggar ut...</span>
        </>
      ) : (
        <span>Logga ut</span>
      )}
    </Button>
  );
}
