"use client";

import ServingsControl from "@/components/servings-control";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  ScheduleRecipeForm,
  ScheduleRecipeFormInput,
} from "@/lib/schemas/scheduled-recipe";
import { Control, Controller } from "react-hook-form";

type ServingsControlFieldProps = {
  control: Control<ScheduleRecipeFormInput, unknown, ScheduleRecipeForm>;
  defaultServings: number;
};

export default function ServingsControlField({
  control,
  defaultServings,
}: ServingsControlFieldProps) {
  return (
    <Controller
      control={control}
      name="servings"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="w-full">
          <FieldLabel htmlFor={field.name}>Antal portioner</FieldLabel>
          <div className="flex h-9 items-center justify-center rounded-md border border-border shadow-xs">
            <ServingsControl
              servings={field.value}
              onServingsChange={field.onChange}
              defaultServings={defaultServings}
            />
          </div>
        </Field>
      )}
    />
  );
}
