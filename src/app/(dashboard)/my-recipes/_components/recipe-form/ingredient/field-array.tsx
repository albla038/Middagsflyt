"use client";

import IngredientFieldRow from "@/app/(dashboard)/my-recipes/_components/recipe-form/ingredient/field-row";
import IngredientInput from "@/app/(dashboard)/my-recipes/_components/recipe-form/ingredient/input";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "recipe.recipeIngredients",
  });

  const handleAddIngredient = useCallback(
    (ingredient: RecipeIngredient) => {
      append(
        {
          id: ingredient.id,
          quantity: ingredient.quantity ? String(ingredient.quantity) : "",
          unit: ingredient.unit ?? "",
          text: ingredient.text,
          note: ingredient.note ?? "",
          ingredientId: ingredient.ingredientId,
        },
        { shouldFocus: false },
      );
    },
    [append],
  );

  return (
    <FieldSet>
      <FieldLegend>Ingredienslista</FieldLegend>
      <FieldDescription>Mata in receptets ingredienser.</FieldDescription>

      <FieldGroup className="gap-3">
        {fields.length > 0 && (
          <ScrollArea>
            <div className="overflow-hidden rounded-md border has-aria-invalid:border-destructive">
              <Table className="min-w-xl">
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="w-18 text-end">Mängd</TableHead>
                    <TableHead>Enhet</TableHead>
                    <TableHead>Text*</TableHead>
                    <TableHead>Anteckning</TableHead>
                    <TableHead>Ingrediens*</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {fields.map((field, index) => (
                    <IngredientFieldRow
                      key={field.id}
                      index={index}
                      ingredients={ingredients}
                      fuse={fuse}
                      isFirst={index === 0}
                      isLast={index === fields.length - 1}
                      onMoveUp={() => move(index, index - 1)}
                      onMoveDown={() => move(index, index + 1)}
                      onRemove={() => remove(index)}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}

        <IngredientInput
          ingredients={ingredients}
          fuse={fuse}
          onAddIngredient={handleAddIngredient}
        />
      </FieldGroup>
    </FieldSet>
  );
}
