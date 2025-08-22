"use client";

import { deleteScheduledNoteAction } from "@/app/(dashboard)/schedule/[...id]/actions";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export type DeleteNoteAlertState =
  | { mode: "CLOSED" }
  | { mode: "OPEN"; noteId: string };

type DeleteNoteAlertProps = {
  scheduleId: string;
  alertState: DeleteNoteAlertState;
  setAlertState: Dispatch<SetStateAction<DeleteNoteAlertState>>;
};

export default function DeleteNoteAlert({
  scheduleId,
  alertState,
  setAlertState,
}: DeleteNoteAlertProps) {
  const isOpen = alertState.mode === "OPEN";

  async function handleDelete() {
    if (isOpen) {
      const state = await deleteScheduledNoteAction({
        scheduleId,
        noteId: alertState.noteId,
      });

      if (state) {
        if (state.success) {
          toast.success(state.message);
        } else {
          toast.error(state.message);
        }
      }

      setAlertState({ mode: "CLOSED" });
    }
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setAlertState({ mode: "CLOSED" });
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Är du säker?</AlertDialogTitle>
          <AlertDialogDescription>
            Denna åtgärd kan inte ångras.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Avbryt</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete}>
            Ja, ta bort anteckningen
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
