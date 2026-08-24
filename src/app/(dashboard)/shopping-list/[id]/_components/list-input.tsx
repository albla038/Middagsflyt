"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IngredientWithAlias } from "@/lib/types";
import {
  cn,
  isExactIngredientMatch,
  parseIngredientInputString,
} from "@/lib/utils";
import { useCreateShoppingListItem } from "@/queries/shopping-list/use-create-shopping-list-item";
import { createId } from "@paralleldrive/cuid2";
import Fuse from "fuse.js";
import { ListOrdered, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";

type ListInputProps = {
  listId: string;
  ingredients: IngredientWithAlias[];
};

export default function ListInput({ listId, ingredients }: ListInputProps) {
  const [input, setInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const placeholder = isInputFocused ? "Sök" : "Lägg till vara";

  const { mutate: createItem } = useCreateShoppingListItem(listId);

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

  function handleSubmit() {
    const trimmedValue = input.trim();

    // Return early if the trimmed value is empty
    if (!trimmedValue) return;

    // Find an existing ingredient if the parsed input name has an exact match
    const existingIngredient = ingredients.find((ingredient) =>
      isExactIngredientMatch(ingredient, parsedInput.name),
    );

    const unit = parsedInput.unit ?? existingIngredient?.shoppingUnit ?? null;
    const categoryId = existingIngredient?.ingredientCategoryId ?? null;

    const capitalizedName =
      parsedInput.name.charAt(0).toUpperCase() + parsedInput.name.slice(1);

    createItem({
      id: createId(),
      name: capitalizedName,
      unit,
      categoryId,
      quantity: parsedInput.quantity,
    });
    setInput("");
  }

  return (
    <div
      tabIndex={-1}
      onFocus={() => setIsInputFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsInputFocused(false);
        }
      }}
      className={cn(
        "sticky bottom-0 z-10 flex max-w-svw flex-col gap-1 border-t border-border bg-background pt-3 pb-1",
        "sm:top-26 sm:mt-8 sm:border-none sm:bg-transparent sm:p-0 sm:pb-3",
      )}
    >
      <div className="absolute -top-9 hidden w-full sm:block">
        <div className="h-24 bg-subtle" />
        <div className="h-10 bg-linear-to-b from-subtle to-transparent" />
      </div>
      <form
        className="relative mx-3 sm:mx-1"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Input
          id="list-item-input"
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
          className="bg-background px-9"
        />

        <Plus className="absolute top-1/2 left-3 size-4 -translate-y-1/2" />

        {input && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-1 size-7 -translate-y-1/2 text-muted-foreground"
            onClick={() => setInput("")}
          >
            <X className="size-4" />
          </Button>
        )}
      </form>

      <ScrollArea className="pb-2 sm:h-12">
        {isInputFocused && (
          <ul className="flex items-center gap-2 p-1 pl-3 sm:pl-1">
            {input ? (
              <li className="flex items-center justify-center">
                <Button
                  variant="primary-inverse"
                  size="sm"
                  onClick={handleSubmit}
                >
                  &quot;{input}&quot;
                </Button>
              </li>
            ) : (
              <li className="flex items-center justify-center">
                <Button variant="primary-inverse" size="sm">
                  <ListOrdered /> Favoritvaror
                </Button>
              </li>
            )}

            {filteredIngredients.map(
              ({
                id,
                displayNameSingular,
                displayNamePlural,
                shoppingUnit,
                ingredientCategoryId,
              }) => (
                <li key={id} className="flex items-center justify-center">
                  <Button
                    variant="primary-inverse"
                    size="sm"
                    onClick={() => {
                      createItem({
                        id: createId(),
                        name: displayNameSingular,
                        quantity: null,
                        unit: shoppingUnit,
                        categoryId: ingredientCategoryId,
                      });
                      setInput("");
                    }}
                  >
                    {parsedInput.name.length > displayNameSingular.length
                      ? displayNamePlural
                      : displayNameSingular}
                  </Button>
                </li>
              ),
            )}
          </ul>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
