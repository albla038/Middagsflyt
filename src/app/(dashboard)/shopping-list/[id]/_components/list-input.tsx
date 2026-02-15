"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useCreateShoppingListItem } from "@/queries/shopping-list/use-create-shopping-list-item";
import { cn, parseIngredientInputString } from "@/lib/utils";
import { ListOrdered, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { createId } from "@paralleldrive/cuid2";
import Fuse from "fuse.js";
import { IngredientWithAlias } from "@/lib/types";

function isExactMatch(
  ingredient: IngredientWithAlias,
  matchValue: string,
): boolean {
  const trimmedMatchValue = matchValue.trim().toLowerCase();
  if (!trimmedMatchValue) return false;

  const { name, displayNameSingular, displayNamePlural, ingredientAliases } =
    ingredient;

  return (
    name.toLowerCase() === trimmedMatchValue ||
    displayNameSingular.toLowerCase() === trimmedMatchValue ||
    displayNamePlural.toLowerCase() === trimmedMatchValue ||
    ingredientAliases.some(
      (alias) => alias.name.toLowerCase() === trimmedMatchValue,
    )
  );
}

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

  const filteredIngredients = fuse
    .search(parsedInput.name)
    .filter(({ item }) => !isExactMatch(item, parsedInput.name))
    .map(({ item }) => item);

  function handleSubmit() {
    const trimmedValue = input.trim();

    // Return early if the trimmed value is empty
    if (!trimmedValue) return;

    const existingIngredient = ingredients.find((ingredient) =>
      isExactMatch(ingredient, parsedInput.name),
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
        "sticky bottom-0 z-10 flex flex-col gap-2 border-t border-border bg-background p-3 pb-0",
        "sm:top-26 sm:mt-8 sm:h-[86px] sm:border-none sm:bg-transparent sm:p-0 sm:pb-3",
      )}
    >
      <div className="absolute -top-9 hidden w-full sm:block">
        <div className="h-20 bg-subtle" />
        <div className="h-12 bg-linear-to-b from-subtle to-transparent" />
      </div>
      <form
        className="relative"
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

      <ScrollArea className="w-full overflow-x-hidden">
        {placeholder === "Sök" && (
          <ul className="flex items-center gap-2 pb-2">
            {input ? (
              <li className="flex items-center justify-center">
                <Badge variant="primary-secondary" onClick={handleSubmit}>
                  &quot;{input}&quot;
                </Badge>
              </li>
            ) : (
              <li className="flex items-center justify-center">
                <Badge>
                  <ListOrdered /> Favoritvaror
                </Badge>
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
                  <Badge
                    variant="primary-secondary"
                    className="cursor-pointer"
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
                  </Badge>
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
