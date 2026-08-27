"use client";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Field, FieldError } from "@/components/ui/field";
import { RecipeFormInput, RecipeFormOutput, RecipeIngredientInput } from "@/lib/schemas/recipe";
import { formatQuantityDecimal } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

type IngredientIdsFieldProps = {
  index: number;
};

export default function IngredientIdsField({ index }: IngredientIdsFieldProps) {
  const form = useFormContext<RecipeFormInput, unknown, RecipeFormOutput>();
  const anchor = useComboboxAnchor();

  const ingredients = form.watch(`recipe.recipeIngredients`);

  return (
    <Controller
      control={form.control}
      name={`recipe.recipeInstructions.${index}.ingredientIds`}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <Combobox
            multiple
            autoHighlight
            items={ingredients}
            value={ingredients.filter((ingredient) =>
              field.value.includes(ingredient.id),
            )}
            onValueChange={(values) =>
              field.onChange(values.map((ingredient) => ingredient.id))
            }
            itemToStringLabel={(ingredient) => ingredient.text}
          >
            <ComboboxChips ref={anchor}>
              <ComboboxValue>
                {(ingredients: RecipeIngredientInput[]) => (
                  <>
                    {ingredients.map((ingredient) => (
                      <ComboboxChip key={ingredient.id}>
                        {ingredient.text}
                      </ComboboxChip>
                    ))}
                  </>
                )}
              </ComboboxValue>
              <ComboboxChipsInput
                placeholder={
                  field.value.length > 0
                    ? undefined
                    : "Välj ingredienser för steget..."
                }
                aria-invalid={fieldState.invalid}
              />
            </ComboboxChips>

            <ComboboxContent anchor={anchor}>
              <ComboboxEmpty>
                Lägg till fler ingredienser i ingredientslistan om de inte finns
                här.
              </ComboboxEmpty>

              <ComboboxList className="scrollbar-none">
                {(ingredient: RecipeIngredientInput) => (
                  <ComboboxItem
                    key={ingredient.id}
                    value={ingredient}
                    className="gap-1"
                  >
                    {ingredient.quantity && (
                      <span className="text-muted-foreground">
                        {formatQuantityDecimal(Number(ingredient.quantity))}
                      </span>
                    )}
                    {ingredient.quantity &&
                      ingredient.unit &&
                      ingredient.unit !== "ST" && (
                        <span className="text-muted-foreground">
                          {ingredient.unit.toLowerCase()}
                        </span>
                      )}
                    <span className="inline">{ingredient.text}</span>
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
