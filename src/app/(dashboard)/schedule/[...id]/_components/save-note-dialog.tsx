"use client";

import { saveScheduledNote } from "@/app/(dashboard)/schedule/[...id]/actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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

import { Textarea } from "@/components/ui/textarea";
import { ScheduledNote } from "@/lib/generated/prisma";
import { sv } from "date-fns/locale";
import { LoaderCircle } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

export type SaveNoteDialogState =
  | { mode: "CLOSED" }
  | {
      mode: "CREATE";
      note: {
        date: Date;
      };
    }
  | { mode: "EDIT"; note: ScheduledNote };

type SaveNoteDialogProps = {
  scheduleId: string;
  dialogState: SaveNoteDialogState;
  setDialogState: Dispatch<SetStateAction<SaveNoteDialogState>>;
};

export default function SaveNoteDialog({
  scheduleId,
  dialogState,
  setDialogState,
}: SaveNoteDialogProps) {
  const isOpen = dialogState.mode !== "CLOSED";
  const isEditMode = dialogState.mode === "EDIT";

  // Calendar date picker state
  const [date, setDate] = useState<Date>(new Date());

  const noteId = isEditMode ? dialogState.note.id : undefined;

  const [state, action, isPending] = useActionState(
    // Pass scheduleId, noteId and date to the action
    saveScheduledNote.bind(null, scheduleId, date, noteId),
    null,
  );

  // Display toasts based on action state
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

  // Sync calendar date with dialog state
  useEffect(() => {
    if (isOpen) {
      setDate(dialogState.note.date);
    }
  }, [isOpen, dialogState]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setDialogState({ mode: "CLOSED" });
      }}
    >
      <DialogContent className="w-fit md:min-w-fit">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Redigera anteckning" : "Skapa ny anteckning"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Här kan du redigera anteckningens datum, titel eller text."
              : "Ange anteckningens datum, titel och text."}
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="grid gap-4">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(value) => {
                if (value) setDate(value);
              }}
              locale={sv}
              className="h-fit w-full rounded-md border border-border p-3 shadow-xs md:w-fit"
              showWeekNumber
            />

            <div className="flex flex-col gap-4 md:w-xs">
              <div className="grid gap-1">
                <Input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={isEditMode ? dialogState.note.title : ""}
                  placeholder="Ange titel"
                  required
                  aria-invalid={!state?.success && !!state?.errors?.title}
                />

                {/* Conditional error display */}
                {!state?.success &&
                  state?.errors?.title?.map((errorMessage, idx) => (
                    <p key={idx} className="text-xs text-destructive">
                      {errorMessage}
                    </p>
                  ))}
              </div>

              <div className="flex h-full flex-col gap-1">
                <Textarea
                  id="text"
                  name="text"
                  placeholder="Ange fritext (valfritt)"
                  defaultValue={isEditMode ? dialogState.note.text || "" : ""}
                  aria-invalid={!state?.success && !!state?.errors?.text}
                  className="h-full"
                />

                {/* Conditional error display */}
                {!state?.success &&
                  state?.errors?.text?.map((errorMessage, idx) => (
                    <p key={idx} className="text-xs text-destructive">
                      {errorMessage}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Avbryt</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
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
