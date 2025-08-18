"use client";

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
import { Dispatch, SetStateAction, useState } from "react";

export type SaveNoteDialogState =
  | { mode: "CLOSED" }
  | { mode: "CREATE" }
  | { mode: "EDIT"; note: ScheduledNote };

type SaveNoteDialogProps = {
  dialogState: SaveNoteDialogState;
  setDialogState: Dispatch<SetStateAction<SaveNoteDialogState>>;
};

export default function SaveNoteDialog({
  dialogState,
  setDialogState,
}: SaveNoteDialogProps) {
  const isOpen = dialogState.mode !== "CLOSED";
  const isEditMode = dialogState.mode === "EDIT";

  const [date, setDate] = useState<Date | undefined>(
    isEditMode ? dialogState.note.date : new Date(),
  );

  const pending = false;
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setDialogState({ mode: "CLOSED" });
      }}
    >
      <DialogContent className="w-fit md:min-w-fit">
        <DialogHeader>
          <DialogTitle>Redigera anteckning</DialogTitle>
          <DialogDescription>
            Här kan du redigera anteckningens datum, titel eller text.
          </DialogDescription>
        </DialogHeader>

        <form action="" className="grid gap-4">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
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
                  // aria-invalid
                />
                {/* // TODO If error */}
                {/* {
                  <p className="text-xs text-destructive">
                  Felmeddelande
                  </p>
                  } */}
              </div>

              <div className="flex h-full flex-col gap-1">
                <Textarea
                  id="text"
                  name="text"
                  placeholder="Ange fritext..."
                  defaultValue={isEditMode ? dialogState.note.text || "" : ""}
                  // aria-invalid={}
                  className="h-full"
                />
                {/* // TODO If error */}
                {/* {
                  <p className="text-xs text-destructive">
                  Felmeddelande
                  </p>
                  } */}
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Avbryt</Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? (
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
