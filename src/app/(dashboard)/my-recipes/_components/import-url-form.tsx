"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormState,
  importRecipeFromUrl,
} from "@/app/(dashboard)/my-recipes/actions";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { MiddagsflytLoader } from "@/components/ui/logo/middagsflyt-loader";
import { CloudUpload } from "lucide-react";

const initialState: FormState = { status: "IDLE" };

export default function ImportUrlForm() {
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
    <form action={formAction} className="grid w-full gap-4">
      <div className="grid gap-1">
        <Label htmlFor="url">Importera recept från webbadress</Label>
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
