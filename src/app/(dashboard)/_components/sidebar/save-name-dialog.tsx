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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LoaderCircle, Plus } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

type SaveScheduleDialogProps = {
  scheduleId?: string;
  mode: "create" | "edit";
};

export default function SaveScheduleDialog({
  scheduleId,
  mode,
}: SaveScheduleDialogProps) {
  const [open, setOpen] = useState(false);

  // Pass scheduleId to the action
  const saveScheduleWithId = saveSchedule.bind(null, scheduleId);
  const [state, action, pending] = useActionState(saveScheduleWithId, null);

  // Display toasts based on action state
  useEffect(() => {
    if (state) {
      if (state.success) {
        setOpen(false);
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="size-5">
              <Plus />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Ny kalender</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Skapa ny kalender" : "Redigera kalender"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Kalendern delas automatisk med alla medlemmar i ditt hushåll"
              : "Byt namn och/eller beskrivning"}
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
                aria-invalid={!state?.success && !!state?.errors?.description}
              />

              {/* Conditional error display */}
              {!state?.success &&
                state?.errors?.name &&
                state.errors.name.map((errorMessage, idx) => (
                  <p key={idx} className="tet-xs text-destructive">
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
