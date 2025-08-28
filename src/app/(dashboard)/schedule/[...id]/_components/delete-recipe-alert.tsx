"use client";

import { deleteScheduledRecipeAction } from "@/app/(dashboard)/schedule/[...id]/actions";
import { useSelection } from "@/app/(dashboard)/schedule/[...id]/selection-provider";
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

export type DeleteRecipeAlertState =
  | { mode: "CLOSED" }
  | { mode: "OPEN"; scheduledRecipeId: string };

type DeleteRecipeAlertProps = {
  scheduleId: string;
  alertState: DeleteRecipeAlertState;
  setAlertState: Dispatch<SetStateAction<DeleteRecipeAlertState>>;
};

export default function DeleteRecipeAlert({
  scheduleId,
  alertState,
  setAlertState,
}: DeleteRecipeAlertProps) {
  const { dispatch } = useSelection();

  const isOpen = alertState.mode === "OPEN";

  async function handleDelete() {
    if (isOpen) {
      const state = await deleteScheduledRecipeAction({
        scheduleId,
        scheduledRecipeId: alertState.scheduledRecipeId,
      });

      if (state) {
        if (state.success) {
          dispatch({
            type: "TOGGLE_RECIPE",
            payload: {
              scheduleId,
              scheduledRecipe: {
                id: alertState.scheduledRecipeId,
                name: "",
              },
            },
          });
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
            Ja, ta bort schemaläggningen
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
