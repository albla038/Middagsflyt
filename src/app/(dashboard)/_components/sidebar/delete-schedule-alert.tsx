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

import { Schedule } from "@/lib/generated/prisma";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export type DeleteAlertState =
  | { mode: "CLOSED" }
  | { mode: "OPEN"; schedule: Schedule };

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
    if (alertState.mode === "OPEN") {
      const result = await deleteScheduleAction(alertState.schedule.id);

      if (result.ok) {
        setAlertState({ mode: "CLOSED" });
        toast.success("Kalendern togs bort");
      } else {
        toast.error(
          "Något gick fel när kalendern skulle tas bort, vänligen försök igen!",
        );
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
