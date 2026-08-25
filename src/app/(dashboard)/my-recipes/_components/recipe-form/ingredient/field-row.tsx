"use client";

import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Unit } from "@/lib/generated/prisma/enums";
import { RecipeFormInput, RecipeFormOutput } from "@/lib/schemas/recipe";
import { Controller, useFormContext } from "react-hook-form";

const unitOptions = Object.values(Unit).map((unit) => ({
  value: unit,
  label: unit.toLowerCase(),
}));

type IngredientFieldRowProps = {
  index: number;
};

export default function IngredientFieldRow({ index }: IngredientFieldRowProps) {
  const form = useFormContext<RecipeFormInput, unknown, RecipeFormOutput>();

  return (
    <FieldGroup className="flex-row gap-1!">
      {/* Quantity input */}
      <Controller
        control={form.control}
        name={`recipe.recipeIngredients.${index}.quantity`}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              type="number"
              min={0}
            />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Unit select */}
      <Controller
        control={form.control}
        name={`recipe.recipeIngredients.${index}.unit`}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Select {...field} onValueChange={field.onChange}>
              <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                <SelectValue placeholder="Välj enhet" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="">-</SelectItem>
                {unitOptions.map((option) => (
                  <SelectItem
                    key={`${field.name}-${option.value}`}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Text input */}
      <Controller
        control={form.control}
        name={`recipe.recipeIngredients.${index}.text`}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Note input */}
      <Controller
        control={form.control}
        name={`recipe.recipeIngredients.${index}.note`}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Notering (valfritt)"
            />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
