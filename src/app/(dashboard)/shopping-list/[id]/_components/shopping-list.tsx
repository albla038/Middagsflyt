"use client";

import ListInput from "@/app/(dashboard)/shopping-list/[id]/_components/list-input";
import ListItem from "@/app/(dashboard)/shopping-list/[id]/_components/list-item";
import { useSortSelection } from "@/app/(dashboard)/shopping-list/sort-selection-provider";
import { Label } from "@/components/ui/label";
import { useShoppingList } from "@/hooks/queries/shopping-list/queries";
import { ShoppingListItemResponse } from "@/lib/schemas/shopping-list";
import { IngredientWithAlias } from "@/lib/types";
import { cn, groupItemsByCategory } from "@/lib/utils";
import { ReactNode, useMemo } from "react";

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

  return (
    <div className="flex h-full flex-col justify-between">
      <ul className="flex flex-col gap-2 p-2">
        {isGroupedByCategory ? (
          <GroupedList
            listId={listId}
            items={list.items}
            categories={categories}
          />
        ) : (
          <FlatList
            listId={listId}
            items={list.items}
            categories={categories}
          />
        )}
      </ul>
      <ListInput listId={listId} ingredients={ingredients} />
    </div>
  );
}

// --- Reusable UI blocks ---

type FlatListProps = {
  listId: string;
  items: ShoppingListItemResponse[];
  categories: { id: string; name: string }[];
};

function FlatList({ listId, items, categories }: FlatListProps) {
  // Separate purchased items from unpurchased items
  const unpurchasedItems = items.filter((item) => !item.isPurchased);
  const purchasedItems = items.filter((item) => item.isPurchased);

  return (
    <>
      {/* Unpurchased items */}
      {unpurchasedItems.length > 0 && (
        <ListGroup className="bg-background">
          {unpurchasedItems.map((item) => (
            <li key={item.id}>
              <ListItem listId={listId} item={item} categories={categories} />
            </li>
          ))}
        </ListGroup>
      )}

      {/* Purchased items */}
      {purchasedItems.length > 0 && (
        <ListGroup title="Handlat">
          {purchasedItems.map((item) => (
            <li key={item.id}>
              <ListItem listId={listId} item={item} categories={categories} />
            </li>
          ))}
        </ListGroup>
      )}
    </>
  );
}

type GroupedListProps = {
  listId: string;
  items: ShoppingListItemResponse[];
  categories: { id: string; name: string }[];
};

function GroupedList({ listId, items, categories }: GroupedListProps) {
  // Group items by category for grouped display
  const groupedItems = useMemo(
    () => groupItemsByCategory(items, categories),
    [items, categories],
  );

  // Separate purchased items from unpurchased groups
  const unpurchasedGroups = [...groupedItems].filter(
    ([name]) => name !== "Handlat",
  );
  const purchasedItems = groupedItems.get("Handlat") ?? [];

  return (
    <>
      {/*  Categories except "Purchased" */}
      {unpurchasedGroups.map(([name, items]) => (
        <ListGroup className="bg-background" title={name} key={name}>
          {items.map((item) => (
            <li key={item.id}>
              <ListItem listId={listId} item={item} categories={categories} />
            </li>
          ))}
        </ListGroup>
      ))}

      {/* Purchased items */}
      {purchasedItems.length > 0 && (
        <ListGroup title="Handlat">
          {purchasedItems.map((item) => (
            <li key={item.id}>
              <ListItem listId={listId} item={item} categories={categories} />
            </li>
          ))}
        </ListGroup>
      )}
    </>
  );
}

type ListGroupProps = {
  title?: string;
  children?: ReactNode;
  className?: string;
};

function ListGroup({ title, children, className }: ListGroupProps) {
  return (
    <li className={cn("flex flex-col gap-3 rounded-md p-3", className)}>
      {title && <Label>{title.toUpperCase()}</Label>}
      <ul className="grid gap-2">{children}</ul>
    </li>
  );
}
