"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { ScheduleWithMembers } from "@/lib/schemas/schedule";
import {
  ScheduleRecipeForm,
  ScheduleRecipeFormInput,
} from "@/lib/schemas/scheduled-recipe";
import { Calendar } from "lucide-react";
import { Control, Controller } from "react-hook-form";

type ScheduleSelectFieldProps = {
  control: Control<ScheduleRecipeFormInput, unknown, ScheduleRecipeForm>;
  schedules: ScheduleWithMembers[] | undefined;
};

export default function ScheduleSelectField({
  control,
  schedules,
}: ScheduleSelectFieldProps) {
  return (
    <Controller
      control={control}
      name="scheduleId"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Kalender</FieldLabel>
          <Select {...field} onValueChange={field.onChange}>
            <SelectTrigger
              id={field.name}
              aria-invalid={fieldState.invalid}
              disabled={!schedules}
            >
              {schedules ? (
                <SelectValue placeholder="Välj kalender" />
              ) : (
                <Spinner />
              )}
            </SelectTrigger>

            <SelectContent>
              {schedules?.map((schedule) => (
                <SelectItem key={schedule.id} value={schedule.id}>
                  <Calendar /> {schedule.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
