"use client";

import IngredientFieldRow from "@/app/(dashboard)/my-recipes/_components/recipe-form/ingredient/field-row";
import IngredientInput from "@/app/(dashboard)/my-recipes/_components/recipe-form/ingredient/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreHorizontal, Trash2 } from "lucide-react";
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
    // Use a different key name to avoid conflicts with the field from the RecipeFormtype
    keyName: "rhfId",
  });

  const handleAppend = useCallback(
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

  const handleRemove = useCallback(
    (index?: number) => {
      const ingredients = form.getValues("recipe.recipeIngredients");
      const idsToRemove = new Set<string>();

      if (index === undefined) {
        // "Clear All" was clicked
        ingredients.forEach((ing) => idsToRemove.add(ing.id));
      } else {
        // Single row was deleted
        idsToRemove.add(ingredients[index].id);
      }

      // Remove the ingredients from ingredients array
      remove(index);

      // Clean up instructions array
      const instructions = form.getValues("recipe.recipeInstructions");
      let hasChanges = false;

      const updatedInstructions = instructions.map((instruction) => {
        const filteredIds = instruction.ingredientIds.filter(
          (id) => !idsToRemove.has(id),
        );

        if (filteredIds.length !== instruction.ingredientIds.length) {
          hasChanges = true;
          return { ...instruction, ingredientIds: filteredIds };
        }
        return instruction;
      });

      // Update instructions array state if any ingredients should be removed
      if (hasChanges) {
        form.setValue("recipe.recipeInstructions", updatedInstructions, {
          shouldDirty: true,
        });
      }
    },
    [form, remove],
  );

  return (
    <FieldSet>
      <FieldLegend>Ingredienslista</FieldLegend>
      <FieldDescription>Mata in receptets ingredienser.</FieldDescription>

      <FieldGroup className="gap-3">
        {fields.length > 0 && (
          <ScrollArea>
            <div className="overflow-hidden rounded-md border has-aria-invalid:border-destructive">
              <Table className="min-w-xl table-fixed">
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="w-18 text-end">Mängd</TableHead>
                    <TableHead className="w-33">Enhet</TableHead>
                    <TableHead>Text*</TableHead>
                    <TableHead className="w-32">Anteckning</TableHead>
                    <TableHead className="w-56">Ingrediens*</TableHead>
                    <TableHead className="w-13">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleRemove()}
                            variant="destructive"
                          >
                            <Trash2 /> Rensa alla
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {fields.map((field, index) => (
                    <IngredientFieldRow
                      key={field.rhfId}
                      index={index}
                      ingredients={ingredients}
                      fuse={fuse}
                      isFirst={index === 0}
                      isLast={index === fields.length - 1}
                      onMoveUp={() => move(index, index - 1)}
                      onMoveDown={() => move(index, index + 1)}
                      onRemove={() => handleRemove(index)}
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
          onAddIngredient={handleAppend}
        />
      </FieldGroup>
    </FieldSet>
  );
}
