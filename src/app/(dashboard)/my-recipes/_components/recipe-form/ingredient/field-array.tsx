"use client";

import IngredientFieldRow from "@/app/(dashboard)/my-recipes/_components/recipe-form/ingredient/field-row";
import IngredientInput from "@/app/(dashboard)/my-recipes/_components/recipe-form/ingredient/input";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";

import {
  RecipeFormInput,
  RecipeFormOutput,
  RecipeIngredient,
} from "@/lib/schemas/recipe";
import { IngredientWithAlias } from "@/lib/types";
import Fuse from "fuse.js";
import { useCallback, useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

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
          <IngredientFieldRow
            key={field.id}
            index={index}
            ingredients={ingredients}
            fuse={fuse}
          />
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
