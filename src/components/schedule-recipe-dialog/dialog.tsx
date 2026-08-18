"use client";

import ResponsiveDialog from "@/components/responsive-dialog";
import { createScheduledRecipeAction } from "@/components/schedule-recipe-dialog/actions";
import AssigneeSelectField from "@/components/schedule-recipe-dialog/fields/assignee-select";
import DateSelectField from "@/components/schedule-recipe-dialog/fields/date-select";
import NoteField from "@/components/schedule-recipe-dialog/fields/note";
import ScheduleSelectField from "@/components/schedule-recipe-dialog/fields/schedule-select";
import ServingsControlField from "@/components/schedule-recipe-dialog/fields/servings-control";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { getActionErrorMessage } from "@/lib/error-messages";
import {
  ScheduleRecipeForm,
  ScheduleRecipeFormInput,
  scheduleRecipeFormSchema,
} from "@/lib/schemas/scheduled-recipe";
import { Recipe } from "@/lib/types/recipe";
import { schedulesQueryOptions } from "@/queries/schedules/options";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useEffect, useMemo, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

type ScheduleRecipeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Pick<Recipe, "id" | "name" | "slug" | "recipeYield">;
  servings: number;
};

export default function ScheduleRecipeDialog({
  open,
  onOpenChange,
  recipe,
  servings,
}: ScheduleRecipeDialogProps) {
  const { data: schedules } = useQuery({
    ...schedulesQueryOptions(),
    staleTime: 0,
    enabled: open,
  });

  const form = useForm<ScheduleRecipeFormInput, unknown, ScheduleRecipeForm>({
    resolver: zodResolver(scheduleRecipeFormSchema),
    defaultValues: {
      recipeId: recipe.id,
      scheduleId: "",
      date: new Date(),
      servings,
      note: "",
      assigneeId: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  // Watch the selected date and schedule ID
  const selectedDate = useWatch({
    control: form.control,
    name: "date",
  });
  const selectedScheduleId = useWatch({
    control: form.control,
    name: "scheduleId",
  });
  const selectedSchedule = useMemo(
    () => schedules?.find((s) => s.id === selectedScheduleId),
    [schedules, selectedScheduleId],
  );

  // Set schedule ID directly if only one schedule exists
  useEffect(() => {
    if (schedules?.length === 1 && !form.getValues("scheduleId")) {
      form.setValue("scheduleId", schedules[0].id, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [schedules, form]);

  // Main submit handler
  function handleSubmit(data: ScheduleRecipeForm) {
    startTransition(async () => {
      const response = await createScheduledRecipeAction(data);

      // Diplay toast error message and return if action fails
      if (!response.success) {
        const errorMessage = getActionErrorMessage(response.errorCode, {
          NOT_FOUND:
            "Receptet, kalendern eller användaren kunde inte hittas. De kanske har tagits bort?",
        });
        toast.error(errorMessage);
        return;
      }

      toast.success("Receptet har schemalagts");
      onOpenChange(false);
    });
  }

  return (
    <ResponsiveDialog
      title={`Schemalägg "${recipe.name}"`}
      description="Välj datum, antal portioner och vem som ska laga receptet."
      open={open}
      onOpenChange={onOpenChange}
      dialogContentClassName="md:max-w-2xl"
      onCloseAnimationEnd={form.reset}
    >
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldGroup className="max-h-[60svh] gap-0 md:max-h-[75svh]">
          <FieldGroup className="scrollbar-none overflow-y-auto pb-7 md:flex-row">
            <FieldGroup className="contents md:flex">
              <div className="order-1 grid grid-cols-2 gap-4 md:contents">
                <ScheduleSelectField
                  control={form.control}
                  schedules={schedules}
                />

                <ServingsControlField
                  control={form.control}
                  defaultServings={recipe.recipeYield ?? 4}
                />
              </div>

              <AssigneeSelectField
                control={form.control}
                members={selectedSchedule?.members}
                className="order-2"
              />

              <NoteField control={form.control} className="order-last" />
            </FieldGroup>

            <DateSelectField control={form.control} className="order-3" />
          </FieldGroup>

          <Field orientation="responsive-reverse">
            <Button
              type="submit"
              disabled={isPending || !form.formState.isDirty}
              className="min-w-64"
            >
              {isPending ? (
                <>
                  <Spinner /> Schemalägger...
                </>
              ) : (
                `Schemalägg den ${format(selectedDate, "do MMMM", { locale: sv })}`
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Avbryt
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </ResponsiveDialog>
  );
}
