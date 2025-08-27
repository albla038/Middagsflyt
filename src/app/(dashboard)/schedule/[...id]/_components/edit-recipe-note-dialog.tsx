"use client";

import { editScheduledRecipeNote } from "@/app/(dashboard)/schedule/[...id]/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScheduledRecipeDisplayContent } from "@/lib/types";
import { LoaderCircle } from "lucide-react";
import { Dispatch, SetStateAction, useActionState, useEffect } from "react";
import { toast } from "sonner";

export type EditRecipeNoteDialogState =
  | {
      mode: "CLOSED";
    }
  | {
      mode: "EDITING";
      scheduledRecipe: ScheduledRecipeDisplayContent;
    };

type EditRecipeNoteDialogProps = {
  scheduleId: string;
  dialogState: EditRecipeNoteDialogState;
  setDialogState: Dispatch<SetStateAction<EditRecipeNoteDialogState>>;
};

export default function EditRecipeNoteDialog({
  scheduleId,
  dialogState,
  setDialogState,
}: EditRecipeNoteDialogProps) {
  const isOpen = dialogState.mode === "EDITING";

  const scheduleRecipeId = isOpen ? dialogState.scheduledRecipe.id : undefined;

  const [state, action, isPending] = useActionState(
    editScheduledRecipeNote.bind(null, scheduleRecipeId, scheduleId),
    null,
  );

  useEffect(() => {
    if (state) {
      if (state.success) {
        toast.success(state.message);
        setDialogState({ mode: "CLOSED" });
      } else {
        toast.error(state.message);
      }
    }
  }, [state, setDialogState]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setDialogState({ mode: "CLOSED" });
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Redigera anteckning</DialogTitle>
          <DialogDescription>
            Redigera det schemalagda receptets anteckning
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="note">Anteckning</Label>
            <div className="grid gap-1">
              <Textarea
                id="note"
                name="note"
                placeholder="Ange fritext..."
                defaultValue={
                  dialogState.mode === "EDITING"
                    ? dialogState.scheduledRecipe.note || ""
                    : ""
                }
                aria-invalid={!state?.success && !!state?.errors?.note}
              />
              {!state?.success &&
                state?.errors?.note?.map((errorMessage, index) => (
                  <p key={index} className="text-xs text-destructive">
                    {errorMessage}
                  </p>
                ))}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Avbryt</Button>
            </DialogClose>
            <Button type="submit">
              {isPending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  <span>Sparar...</span>
                </>
              ) : (
                <span>Spara</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
