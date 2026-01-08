"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useCreateShoppingListItem } from "@/hooks/queries/shopping-list/mutations";
import { cn } from "@/lib/utils";
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
  const [value, setValue] = useState("");
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

  const filteredIngredients = fuse
    .search(value)
    .filter(({ item }) => !isExactMatch(item, value))
    .map(({ item }) => item);

  function handleSubmit() {
    const trimmedValue = value.trim();

    if (trimmedValue) {
      const existingIngredient = ingredients.find((ingredient) =>
        isExactMatch(ingredient, trimmedValue),
      );

      const unit = existingIngredient?.shoppingUnit || null;
      const categoryId = existingIngredient?.ingredientCategoryId || null;

      const capitalizedValue =
        trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1);

      createItem({
        id: createId(),
        name: capitalizedValue,
        unit,
        categoryId,
        quantity: null,
        displayOrder: null,
      });
      setValue("");
    }
  }

  // const inputTokens = value.split(/\s+/);
  // const rawInputQuantity = inputTokens.at(0);
  // const inputQuantity =
  //   rawInputQuantity && !Number.isNaN(Number.parseInt(rawInputQuantity))
  //     ? Number.parseInt(rawInputQuantity)
  //     : undefined;

  // const inputUnit = inputQuantity ? inputTokens.at(1) : undefined;
  // const inputIsPlural = inputQuantity ? inputQuantity > 1 : false;

  // console.log("quantity: ", inputQuantity);
  // console.log("unit: ", inputUnit);

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
        "sticky bottom-0 z-20 grid gap-2 border-t border-border bg-background p-3 pb-1",
        "sm:border-none sm:bg-transparent sm:px-2 sm:pb-6",
      )}
    >
      <form
        className="relative"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-background px-9"
        />

        <Plus className="absolute top-1/2 left-3 size-4 -translate-y-1/2" />

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="right- absolute top-1/2 right-1 size-7 -translate-y-1/2 text-muted-foreground"
            onClick={() => setValue("")}
          >
            <X className="size-4" />
          </Button>
        )}
      </form>

      <ScrollArea className="w-full overflow-x-hidden">
        {placeholder === "Sök" && (
          <ul className="flex items-center gap-2 pb-2">
            {value ? (
              <li className="flex items-center justify-center">
                <Badge variant="primary-secondary" onClick={handleSubmit}>
                  &quot;{value}&quot;
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
                        displayOrder: null,
                        categoryId: ingredientCategoryId,
                      });
                      setValue("");
                    }}
                  >
                    {/* {inputIsPlural ? displayNamePlural : displayNameSingular} */}
                    {displayNameSingular}
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
