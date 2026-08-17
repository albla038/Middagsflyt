"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  ScheduleRecipeForm,
  ScheduleRecipeFormInput,
} from "@/lib/schemas/scheduled-recipe";
import { cn } from "@/lib/utils";
import { Control, Controller } from "react-hook-form";

type NoteFieldProps = {
  control: Control<ScheduleRecipeFormInput, unknown, ScheduleRecipeForm>;
  className?: string;
};

export default function NoteField({ control, className }: NoteFieldProps) {
  return (
    <Controller
      control={control}
      name="note"
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          className={cn("h-full", className)}
        >
          <FieldLabel htmlFor={field.name}>Fritext</FieldLabel>
          <Textarea
            {...field}
            id={field.name}
            aria-invalid={fieldState.invalid}
            placeholder="Valfri fritext"
            className="h-full resize-none"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
