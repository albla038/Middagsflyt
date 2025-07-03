"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormState, importRecipeFromUrl } from "@/app/actions";
import { LoaderCircle } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { MiddagsflytLoader } from "@/components/ui/logo/middagsflyt-loader";

const initialState: FormState = { status: "IDLE" };

export default function UrlForm() {
  const [state, formAction, pending] = useActionState(
    importRecipeFromUrl,
    initialState,
  );

  useEffect(() => {
    if (state.status === "SUCCESS") {
      toast.success(state.message);
    }

    if (state.status === "ERROR") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="grid w-full gap-3">
      <Label htmlFor="url">Importera recept från webbadress</Label>
      <div className="flex items-start gap-4">
        <div className="grid w-full gap-1">
          <Input
            id="url"
            name="url"
            type="url"
            placeholder="https://www.recept.se/..."
            aria-invalid={state.status === "ERROR" && !!state.errors?.url}
          />
          {state.status === "ERROR" &&
            state.errors?.url &&
            state.errors?.url.map((errorMessage, idx) => (
              <p key={idx} className="text-xs text-destructive">
                {errorMessage}
              </p>
            ))}
        </div>
        <Button disabled={pending}>
          {pending ? (
            <>
              <span>Importerar...</span>
              {/* <LoaderCircle className="animate-spin" /> */}
              <MiddagsflytLoader className="size-4" />
            </>
          ) : (
            "Importera"
          )}
        </Button>
      </div>
    </form>
  );
}
