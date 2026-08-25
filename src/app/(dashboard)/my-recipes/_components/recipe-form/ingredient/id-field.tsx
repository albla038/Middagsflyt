"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldError } from "@/components/ui/field";
import { RecipeFormInput, RecipeFormOutput } from "@/lib/schemas/recipe";
import { IngredientWithAlias } from "@/lib/types";
import Fuse from "fuse.js";
import { useCallback, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

type IngredientIdFieldProps = {
  index: number;
  fuse: Fuse<IngredientWithAlias>;
};

export default function IngredientIdField({
  index,
  fuse,
}: IngredientIdFieldProps) {
  const form = useFormContext<RecipeFormInput, unknown, RecipeFormOutput>();

  const ingredientText = form.watch(`recipe.recipeIngredients.${index}.text`);

  const matchingIngredients = useMemo(
    () => fuse.search(ingredientText).map(({ item }) => item),
    [fuse, ingredientText],
  );

  const findIngredientById = useCallback(
    (id: string) =>
      matchingIngredients.find((ingredient) => ingredient.id === id),
    [matchingIngredients],
  );

  return (
    <Controller
      control={form.control}
      name={`recipe.recipeIngredients.${index}.ingredientId`}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <Combobox
            value={findIngredientById(field.value) ?? null}
            onValueChange={(value) => field.onChange(value ? value.id : "")}
            items={matchingIngredients}
            itemToStringLabel={(ingredient) => ingredient.name}
            autoHighlight
          >
            <ComboboxInput
              aria-invalid={fieldState.invalid}
              placeholder="Sök efter ingrediens..."
              type="text"
            />

            <ComboboxContent>
              <ComboboxEmpty>
                Inga matchande ingredienser hittades.
              </ComboboxEmpty>

              <ComboboxList>
                {(ingredient: IngredientWithAlias) => (
                  <ComboboxItem key={ingredient.id} value={ingredient}>
                    {ingredient.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
