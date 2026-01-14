"use client";

import ListInput from "@/app/(dashboard)/shopping-list/[id]/_components/list-input";
import ListItem from "@/app/(dashboard)/shopping-list/[id]/_components/list-item";
import { useSortSelection } from "@/app/(dashboard)/shopping-list/sort-selection-provider";
import { Label } from "@/components/ui/label";
import { useShoppingList } from "@/hooks/queries/shopping-list/queries";
import { IngredientWithAlias } from "@/lib/types";
import { groupItemsByCategory } from "@/lib/utils";
import { Activity } from "react";

type ShoppingListProps = {
  listId: string;
  categories: { id: string; name: string }[];
  ingredients: IngredientWithAlias[];
};

export default function ShoppingList({
  listId,
  categories,
  ingredients,
}: ShoppingListProps) {
  const { data: list, isPending, error } = useShoppingList(listId);

  const { isGroupedByCategory } = useSortSelection();

  if (isPending) {
    return <p>Läser in...</p>; // TODO improve
  }

  if (error) {
    return <p className="text-destructive">{error.message}</p>; // TODO improve
  }

  const { items } = list;

  // Group items by category for display
  const groupedItems = groupItemsByCategory(items, categories);

  return (
    <div className="flex h-full flex-col justify-between">
      {isGroupedByCategory ? (
        <ul className="flex flex-col gap-2 p-2">
          {/*  Categories except "Purchased" */}
          {[...groupedItems].map(
            ([name, items]) =>
              name !== "Handlat" && (
                <li
                  key={name}
                  className="flex flex-col gap-3 rounded-md bg-background p-3"
                >
                  <Label>{name.toUpperCase()}</Label>
                  <ul className="grid gap-2">
                    {items.map((item) => (
                      <li key={item.id}>
                        <ListItem
                          listId={listId}
                          item={item}
                          categories={categories}
                        />
                      </li>
                    ))}
                  </ul>
                </li>
              ),
          )}

          {/* Purchased items */}
          {groupedItems.has("Handlat") && (
            <li className="flex flex-col gap-3 rounded-md p-3">
              <Label>{"Handlat".toUpperCase()}</Label>
              <ul className="grid gap-2">
                {groupedItems.get("Handlat")?.map((item) => (
                  <li key={item.id}>
                    <ListItem
                      listId={listId}
                      item={item}
                      categories={categories}
                    />
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      ) : (
        <ul className="flex flex-col gap-2 p-2">
          <li className="flex flex-col gap-3 rounded-md bg-background p-3">
            <ul className="grid gap-2">
              {items.map(
                (item) =>
                  !item.isPurchased && (
                    <li key={item.id}>
                      <ListItem
                        listId={listId}
                        item={item}
                        categories={categories}
                      />
                    </li>
                  ),
              )}
            </ul>
          </li>

          <Activity
            mode={items.some((item) => item.isPurchased) ? "visible" : "hidden"}
          >
            <li className="flex flex-col gap-3 rounded-md p-3">
              <Label>{"Handlat".toUpperCase()}</Label>
              <ul className="grid gap-2">
                {list.items.map(
                  (item) =>
                    item.isPurchased && (
                      <li key={item.id}>
                        <ListItem
                          listId={listId}
                          item={item}
                          categories={categories}
                        />
                      </li>
                    ),
                )}
              </ul>
            </li>
          </Activity>
        </ul>
      )}
      <ListInput listId={listId} ingredients={ingredients} />
    </div>
  );
}
