"use client";

import IngredientInput from "@/app/(dashboard)/my-recipes/_components/recipe-form/ingredient/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Unit } from "@/lib/generated/prisma/enums";
import {
  RecipeFormInput,
  RecipeFormOutput,
  RecipeIngredient,
} from "@/lib/schemas/recipe";
import { IngredientWithAlias } from "@/lib/types";
import { SelectValue } from "@radix-ui/react-select";
import Fuse from "fuse.js";
import { useCallback, useMemo } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

const unitOptions = Object.values(Unit).map((unit) => ({
  value: unit,
  label: unit.toLowerCase(),
}));

type IngredientFieldArrayProps = {
  ingredients: IngredientWithAlias[];
};

export default function IngredientFieldArray({
  ingredients,
}: IngredientFieldArrayProps) {
  const fuse = useMemo(
    () =>
      new Fuse(ingredients, {
        keys: [
          "name",
          "displayNameSingular",
          "displayNamePlural",
          "ingredientAliases.name",
        ],
        threshold: 0.4,
        ignoreDiacritics: true,
        includeScore: true,
      }),
    [ingredients],
  );

  const form = useFormContext<RecipeFormInput, unknown, RecipeFormOutput>();

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "recipe.recipeIngredients",
  });

  const handleAddIngredient = useCallback(
    (ingredient: RecipeIngredient) => {
      append({
        id: ingredient.id,
        quantity: ingredient.quantity ? String(ingredient.quantity) : "",
        unit: ingredient.unit ?? "",
        text: ingredient.text,
        note: ingredient.note ?? "",
        ingredientId: ingredient.ingredientId,
      });
    },
    [append],
  );

  return (
    <FieldSet>
      <FieldLegend>Ingredienser</FieldLegend>
      <FieldDescription></FieldDescription>

      <FieldGroup>
        {fields.map((field, index) => (
          <FieldGroup key={field.id} className="flex-row gap-1!">
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
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                    >
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
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        ))}

        <IngredientInput
          ingredients={ingredients}
          fuse={fuse}
          onAddIngredient={handleAddIngredient}
        />
      </FieldGroup>
    </FieldSet>
  );
}
