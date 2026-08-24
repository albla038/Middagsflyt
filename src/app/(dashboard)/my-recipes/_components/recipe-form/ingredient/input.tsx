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
    [ingredients, parsedInput],
  );

  const submitIngredient = useCallback(() => {
    const value = input.trim();
    // Return early if the trimmed value is empty
    if (!value) return;

    const existingIngredient = findMatchingIngredient();

    const unit = parsedInput.unit ?? existingIngredient?.shoppingUnit ?? null;
    const capitalizedName =
      parsedInput.name.charAt(0).toUpperCase() + parsedInput.name.slice(1);

    onAddIngredient({
      id: createId(),
      quantity: parsedInput.quantity,
      unit,
      text: capitalizedName,
      note: null,
      ingredientId: existingIngredient?.id ?? "",
    });

    setInput("");
  }, [input, findMatchingIngredient, parsedInput, onAddIngredient]);

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
            ({ id, displayNameSingular, displayNamePlural }) => {
              const name =
                parsedInput.name.length > displayNameSingular.length
                  ? displayNamePlural
                  : displayNameSingular;

              const existingIngredient = findMatchingIngredient();
              const unit =
                parsedInput.unit ?? existingIngredient?.shoppingUnit ?? null;

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
                        unit,
                        text: name,
                        note: null,
                        ingredientId: existingIngredient?.id ?? "",
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
