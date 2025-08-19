import { deleteScheduleAction } from "@/app/(dashboard)/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export type DeleteAlertState =
  | { mode: "CLOSED" }
  | { mode: "OPEN"; scheduleId: string };

type DeleteScheduleAlertProps = {
  alertState: DeleteAlertState;
  setAlertState: Dispatch<SetStateAction<DeleteAlertState>>;
};

export default function DeleteScheduleAlert({
  alertState,
  setAlertState,
}: DeleteScheduleAlertProps) {
  const isOpen = alertState.mode === "OPEN";

  async function handleDelete() {
    if (isOpen) {
      const state = await deleteScheduleAction(alertState.scheduleId);

      if (state) {
        if (state.success) {
          setAlertState({ mode: "CLOSED" });
          toast.success(state.message);
        } else {
          toast.error(state.message);
        }
      }
    }
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setAlertState({ mode: "CLOSED" });
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span>Är du säker?</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Denna åtgärd kan inte ångras. Kalendern och dess schemalagda recept
            och anteckningar kommer att tas bort permanent.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Avbryt</AlertDialogCancel>

          <AlertDialogAction onClick={handleDelete}>
            Ja, ta bort kalender
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
