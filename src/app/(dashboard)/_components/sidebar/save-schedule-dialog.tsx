"use client";

import { saveSchedule } from "@/app/(dashboard)/actions";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Schedule } from "@/lib/generated/prisma";
import { LoaderCircle } from "lucide-react";
import { Dispatch, SetStateAction, useActionState, useEffect } from "react";
import { toast } from "sonner";

export type DialogState =
  | { mode: "CLOSED" }
  | { mode: "CREATE" }
  | {
      mode: "EDIT";
      schedule: Schedule;
    };

type SaveScheduleDialogProps = {
  dialogState: DialogState;
  setDialogState: Dispatch<SetStateAction<DialogState>>;
};

export default function SaveScheduleDialog({
  dialogState,
  setDialogState,
}: SaveScheduleDialogProps) {
  const scheduleId =
    dialogState.mode === "EDIT" ? dialogState.schedule.id : undefined;

  // Pass scheduleId to the action
  const saveScheduleWithId = saveSchedule.bind(null, scheduleId);
  const [state, action, pending] = useActionState(saveScheduleWithId, null);

  // Derive state for edit mode
  const isEditMode = dialogState.mode === "EDIT";
  
  // Display toasts based on action state
  useEffect(() => {
    if (state) {
      if (state.success) {
        setDialogState({ mode: "CLOSED" });
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state, setDialogState]);


  return (
    <Dialog
      open={dialogState.mode !== "CLOSED"}
      onOpenChange={(open) => {
        if (!open) setDialogState({ mode: "CLOSED" });
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Redigera kalender" : "Skapa ny kalender"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Byt namn och/eller beskrivning"
              : "Kalendern delas automatisk med alla medlemmar i ditt hushåll"}
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Namn</Label>
            <div className="grid gap-1">
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Ange namn"
                defaultValue={isEditMode ? dialogState.schedule.name : ""}
                aria-invalid={!state?.success && !!state?.errors?.description}
              />

              {/* Conditional error display */}
              {!state?.success &&
                state?.errors?.name &&
                state.errors.name.map((errorMessage, idx) => (
                  <p key={idx} className="text-xs text-destructive">
                    {errorMessage}
                  </p>
                ))}
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="description">Beskrivning</Label>
            <div className="grid gap-1">
              <Textarea
                id="description"
                name="description"
                placeholder="Ange beskrivning (valfritt)"
                defaultValue={
                  isEditMode ? dialogState.schedule.description || "" : ""
                }
                aria-invalid={!state?.success && !!state?.errors?.description}
                className="min-h-9"
              />

              {/* Conditional error display */}
              {!state?.success &&
                state?.errors?.description &&
                state.errors.description.map((errorMessage, idx) => (
                  <p key={idx} className="text-xs text-destructive">
                    {errorMessage}
                  </p>
                ))}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Avbryt</Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <>
                  <LoaderCircle />
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
