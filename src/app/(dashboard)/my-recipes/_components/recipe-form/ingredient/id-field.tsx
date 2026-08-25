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
import { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type IngredientIdFieldProps = {
  index: number;
  ingredients: IngredientWithAlias[];
  fuse: Fuse<IngredientWithAlias>;
};

export default function IngredientIdField({
  index,
  ingredients,
  fuse,
}: IngredientIdFieldProps) {
  const form = useFormContext<RecipeFormInput, unknown, RecipeFormOutput>();
  const ingredientText = form.watch(`recipe.recipeIngredients.${index}.text`);

  // State to manage the combobox input query
  const [comboboxQuery, setComboboxQuery] = useState("");

  // Filter ingredients based on the combobox query or the ingredient text
  const matchingIngredients = useMemo(() => {
    // Prioritize the combobox query if available
    const query = comboboxQuery || ingredientText;

    if (!query) return [];

    return fuse.search(query).map(({ item }) => item);
  }, [ingredientText, comboboxQuery, fuse]);

  return (
    <Controller
      control={form.control}
      name={`recipe.recipeIngredients.${index}.ingredientId`}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <Combobox
            onInputValueChange={setComboboxQuery}
            value={
              ingredients.find((ingredient) => ingredient.id === field.value) ??
              null
            }
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

            <ComboboxContent className="w-fit">
              <ComboboxEmpty>
                Inga matchande ingredienser hittades.
              </ComboboxEmpty>

              <ComboboxList className="scrollbar-none">
                {(ingredient: IngredientWithAlias) => (
                  <ComboboxItem key={ingredient.id} value={ingredient}>
                    {ingredient.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          {fieldState.error && (
            <FieldError errors={[fieldState.error]} className="text-wrap" />
          )}
        </Field>
      )}
    />
  );
}
