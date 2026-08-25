"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ProteinType, RecipeType } from "@/lib/generated/prisma/enums";
import { RecipeFormInput, RecipeFormOutput } from "@/lib/schemas/recipe";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

const recipeTypeOptions = Object.values(RecipeType).map((type) => ({
  value: type,
  label: type.charAt(0) + type.slice(1).toLowerCase(),
}));

const proteinOptions = Object.values(ProteinType).map((type) => ({
  value: type,
  label: type.charAt(0) + type.slice(1).toLowerCase(),
}));

export default function DetailsFieldSet() {
  const form = useFormContext<RecipeFormInput, unknown, RecipeFormOutput>();

  const [isOvenToggled, setIsOvenToggled] = useState(false);

  return (
    <FieldSet>
      <FieldLegend>Detaljer</FieldLegend>
      <FieldDescription>
        Här kan du ange fler detaljer om ditt recept.
      </FieldDescription>

      <FieldGroup className="grid grid-cols-2 gap-4">
        {/* Yield/servings input */}
        <Controller
          control={form.control}
          name="recipe.recipeYield"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Portioner*</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Ange antal portioner"
                type="number"
                min={1}
                step={1}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Recipe type select */}
        <Controller
          control={form.control}
          name="recipe.recipeType"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Typ av mål*</FieldLabel>
              <Select {...field} onValueChange={field.onChange}>
                <SelectTrigger
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Välj typ av mål" />
                </SelectTrigger>

                <SelectContent>
                  {recipeTypeOptions.map((option) => (
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

        {/* Total time input */}
        <Controller
          control={form.control}
          name="recipe.totalTimeSeconds"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Tillagningstid (min)</FieldLabel>
              <Input
                {...field}
                value={field.value === "" ? "" : Number(field.value) / 60}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(
                    value === "" ? "" : String(Number(value) * 60),
                  );
                }}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Ange total tid i minuter"
                type="number"
                min={5}
                step={5}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Protein select */}
        <Controller
          control={form.control}
          name="recipe.proteinType"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Protein</FieldLabel>
              <Select {...field} onValueChange={field.onChange}>
                <SelectTrigger
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Välj typ av protein" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="">-</SelectItem>
                  {proteinOptions.map((option) => (
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

        {/* Oven temperature */}
        <Controller
          control={form.control}
          name="recipe.oven"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="relative">
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor={`${field.name}-{switch}`}>Ugn</FieldLabel>
                <Switch
                  id={`${field.name}-{switch}`}
                  size="sm"
                  checked={isOvenToggled}
                  onCheckedChange={(checked) => {
                    setIsOvenToggled(checked);
                    if (!checked) {
                      // Clear the value if the user toggles the switch off
                      field.onChange("");
                    }
                  }}
                />
              </div>

              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                disabled={!isOvenToggled}
                placeholder={
                  isOvenToggled ? "Ange ugnstemperatur (°C)" : "Ingen ugn"
                }
                type="number"
                min={50}
                step={5}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}

              {/* Hidden clickable div to enable click anywhere to toggle input */}
              {!isOvenToggled && (
                <div
                  className="absolute inset-0"
                  role="button"
                  onClick={() => setIsOvenToggled(true)}
                />
              )}
            </Field>
          )}
        />
      </FieldGroup>
    </FieldSet>
  );
}
