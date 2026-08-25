"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RecipeIngredient } from "@/lib/schemas/recipe";
import { IngredientWithAlias } from "@/lib/types";
import {
  isExactIngredientMatch,
  parseIngredientInputString,
} from "@/lib/utils";
import { createId } from "@paralleldrive/cuid2";
import Fuse from "fuse.js";
import { ArrowUp, Plus } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";

type IngredientInputProps = {
  ingredients: IngredientWithAlias[];
  fuse: Fuse<IngredientWithAlias>;
  onAddIngredient: (ingredient: RecipeIngredient) => void;
};

function IngredientInput({
  ingredients,
  fuse,
  onAddIngredient,
}: IngredientInputProps) {
  const [input, setInput] = useState("");

  // Parse the input value to extract name, quantity, and unit
  const parsedInput = useMemo(() => parseIngredientInputString(input), [input]);

  // Filter the ingredients based on the parsed input name, excluding exact matches
  const filteredIngredients = useMemo(
    () =>
      fuse
        .search(parsedInput.name)
        .filter(({ item }) => !isExactIngredientMatch(item, parsedInput.name))
        .map(({ item }) => item),
    [fuse, parsedInput.name],
  );

  // Find an existing ingredient if the parsed input name has an exact match
  const findMatchingIngredient = useCallback(
    () =>
      ingredients.find((ingredient) =>
        isExactIngredientMatch(ingredient, parsedInput.name),
      ),
    [ingredients, parsedInput.name],
  );

  const submitIngredient = useCallback(() => {
    const value = input.trim();
    if (!value) return;

    let ingredientId = "";
    let unit = parsedInput.unit;

    // 1. Check for perfect match first
    const exactMatch = findMatchingIngredient();

    if (exactMatch) {
      ingredientId = exactMatch.id;
      unit = unit ?? exactMatch.shoppingUnit;
    } else {
      // 2. Check for fuzzy match with high confidence (< 0.1)
      const searchResults = fuse.search(parsedInput.name);
      const topResult = searchResults.at(0);

      if (topResult && topResult.score !== undefined && topResult.score < 0.1) {
        ingredientId = topResult.item.id;
        unit = unit ?? topResult.item.shoppingUnit;
      }
    }

    const capitalizedName =
      parsedInput.name.charAt(0).toUpperCase() + parsedInput.name.slice(1);

    onAddIngredient({
      id: createId(),
      quantity: parsedInput.quantity,
      unit,
      text: capitalizedName,
      note: null,
      ingredientId,
    });

    setInput("");
  }, [input, findMatchingIngredient, fuse, parsedInput, onAddIngredient]);

  return (
    <div className="group flex flex-col gap-1" tabIndex={-1}>
      <InputGroup>
        <InputGroupInput
          type="text"
          placeholder="Lägg till ny ingrediens"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              submitIngredient();
            }
          }}
          autoComplete="off"
        />
        <InputGroupAddon>
          <Plus />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="default"
            type="button"
            size="icon-xs"
            className="rounded-full"
            onClick={submitIngredient}
          >
            <ArrowUp />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <ScrollArea className="h-12">
        <ul className="hidden items-center gap-2 p-1 pb-3 group-focus-within:flex">
          {input && (
            <li className="flex items-center justify-center">
              <Button
                variant="primary-inverse"
                size="sm"
                type="button"
                onClick={submitIngredient}
              >
                &quot;{input}&quot;
              </Button>
            </li>
          )}

          {filteredIngredients.map(
            ({ id, displayNameSingular, displayNamePlural, shoppingUnit }) => {
              const name =
                parsedInput.name.length > displayNameSingular.length
                  ? displayNamePlural
                  : displayNameSingular;

              return (
                <li key={id} className="flex items-center justify-center">
                  <Button
                    variant="primary-inverse"
                    size="sm"
                    type="button"
                    onClick={() => {
                      onAddIngredient({
                        id: createId(),
                        quantity: parsedInput.quantity,
                        unit: parsedInput.unit ?? shoppingUnit,
                        text: name,
                        note: null,
                        ingredientId: id ?? "",
                      });
                      setInput("");
                    }}
                  >
                    {name}
                  </Button>
                </li>
              );
            },
          )}
        </ul>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

export default memo(IngredientInput);
