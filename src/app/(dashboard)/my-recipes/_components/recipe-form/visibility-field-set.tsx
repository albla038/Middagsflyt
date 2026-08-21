"use client";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RecipeForm, RecipeFormInput } from "@/lib/schemas/recipe";
import { EyeOff, Globe2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

const visibilityOptions = [
  {
    value: "true",
    label: (
      <>
        <Globe2 className="size-4" /> Offentlig
      </>
    ),
    description:
      "Receptet är synligt för alla. Tack för att du gör Middagsflyt bättre! Du kan när som helst ändra synligheten för ditt recept.",
  },
  {
    value: "false",
    label: (
      <>
        <EyeOff className="size-4" /> Privat
      </>
    ),
    description:
      "Receptet är dolt. Endast du kan se och planera måltider med det.",
  },
];

export default function VisibilityFieldSet() {
  const form = useFormContext<RecipeFormInput, unknown, RecipeForm>();

  return (
    <Controller
      control={form.control}
      name="recipe.isPublic"
      render={({ field, fieldState }) => (
        <FieldSet>
          <FieldLegend>Synlighet</FieldLegend>
          <FieldDescription>
            Genom att dela ditt recept bidrar du till Middagsflyts bibliotek och
            hjälper andra att hitta inspiration till sina måltider.
          </FieldDescription>
          <RadioGroup
            name={field.name}
            value={field.value ? "true" : "false"}
            onValueChange={(val) => field.onChange(val === "true")}
          >
            {visibilityOptions.map((option) => (
              <FieldLabel
                key={option.value}
                htmlFor={`${field.name}-${option.value}`}
              >
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldTitle>{option.label}</FieldTitle>
                    {option.value === String(field.value) && (
                      <FieldDescription>{option.description}</FieldDescription>
                    )}
                  </FieldContent>
                  <RadioGroupItem
                    value={option.value}
                    id={`${field.name}-${option.value}`}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
}
