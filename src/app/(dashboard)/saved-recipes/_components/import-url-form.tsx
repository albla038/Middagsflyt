"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { importRecipeFromUrl } from "@/app/(dashboard)/saved-recipes/actions";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { MiddagsflytLoader } from "@/components/ui/logo/middagsflyt-loader";
import { CloudUpload } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ImportUrlForm() {
  const [state, formAction, pending] = useActionState(
    importRecipeFromUrl,
    null,
  );

  const router = useRouter();

  useEffect(() => {
    if (state) {
      if (state.success) {
        if (state.data) {
          toast.success(state.message, {
            action: {
              label: "Gå till recept",
              onClick: () => router.push(`/library/${state.data}`),
            },
          });
        } else {
          toast.success(state.message);
        }
      } else {
        toast.error(state.message);
      }
    }
  }, [state, router]);

  return (
    <form action={formAction} className="grid w-full gap-4">
      <div className="grid gap-3">
        <Label htmlFor="url">Importera recept från webbadress</Label>
        <div className="grid w-full gap-1">
          <Input
            id="url"
            name="url"
            type="url"
            placeholder="https://www.recept.se/..."
            aria-invalid={!state?.success && !!state?.errors?.url}
          />
          {!state?.success &&
            state?.errors?.url &&
            state.errors?.url.map((errorMessage, idx) => (
              <p key={idx} className="text-xs text-destructive">
                {errorMessage}
              </p>
            ))}
        </div>
      </div>

      <Button disabled={pending}>
        {pending ? (
          <>
            <MiddagsflytLoader className="size-4" />
            <span>Importerar...</span>
          </>
        ) : (
          <>
            <CloudUpload />
            <span>Importera</span>
          </>
        )}
      </Button>
    </form>
  );
}
