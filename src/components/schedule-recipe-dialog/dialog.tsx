"use client";

import ResponsiveDialog from "@/components/responsive-dialog";
import AssigneeSelectField from "@/components/schedule-recipe-dialog/fields/assignee-select";
import DateSelectField from "@/components/schedule-recipe-dialog/fields/date-select";
import NoteField from "@/components/schedule-recipe-dialog/fields/note";
import ScheduleSelectField from "@/components/schedule-recipe-dialog/fields/schedule-select";
import ServingsControlField from "@/components/schedule-recipe-dialog/fields/servings-control";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
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
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

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

  // Watch the selected date to update the submit button text
  const selectedDate = useWatch({
    control: form.control,
    name: "date",
  });

  // Set schedule ID directly if only one schedule exists
  useEffect(() => {
    if (schedules?.length === 1 && !form.getValues("scheduleId")) {
      form.setValue("scheduleId", schedules[0].id, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [schedules, form]);

  const selectedSchedule = useMemo(
    () => schedules?.find((s) => s.id === form.getValues("scheduleId")),
    [schedules, form],
  );

  // Main submit handler
  function handleSubmit(data: ScheduleRecipeForm) {
    console.log(data);
  }

  return (
    <ResponsiveDialog
      title={`Schemalägg "${recipe.name}"`}
      description="Välj datum, antal portioner och vem som ska laga receptet."
      open={open}
      onOpenChange={onOpenChange}
      dialogContentClassName="md:max-w-2xl"
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
            <Button type="submit" disabled={!form.formState.isDirty}>
              Schemalägg den {format(selectedDate, "do MMMM", { locale: sv })}
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
