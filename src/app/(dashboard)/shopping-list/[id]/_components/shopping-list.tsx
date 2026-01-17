"use client";

import ListInput from "@/app/(dashboard)/shopping-list/[id]/_components/list-input";
import ListItem from "@/app/(dashboard)/shopping-list/[id]/_components/list-item";
import { useSortSelection } from "@/app/(dashboard)/shopping-list/sort-selection-provider";
import { Label } from "@/components/ui/label";
import { useShoppingList } from "@/queries/shopping-list/use-shopping-list";
import { ShoppingListItemResponse } from "@/lib/schemas/shopping-list";
import { IngredientWithAlias } from "@/lib/types";
import {
  calculateNewDisplayOrder,
  cn,
  groupItemsByCategory,
} from "@/lib/utils";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { shoppingListQueryOptions } from "@/queries/shopping-list/options";
import { getQueryClient } from "@/lib/query-client";
import { useReorderShoppingListItem } from "@/queries/shopping-list/use-reorder-shopping-list-item";

const queryClient = getQueryClient();

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
  // Shopping list cache hooks
  const { data, isPending, error } = useShoppingList(listId);
  const { mutate: reorderItem } = useReorderShoppingListItem(listId);
  const queryKey = shoppingListQueryOptions(listId).queryKey;

  // Local list items state
  const [items, setItems] = useState<ShoppingListItemResponse[]>(
    data?.items || [],
  );

  // List sorting selection context
  const { isGroupedByCategory } = useSortSelection();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      // Cancel if the active item is dragged over itself
      if (!over || active.id === over.id) return;

      setItems((prevItems) => {
        const activeIndex = prevItems.findIndex((i) => i.id === active.id);
        const overIndex = prevItems.findIndex((i) => i.id === over.id);

        // Cancel if either index isn't found
        if (activeIndex === -1 || overIndex === -1) return prevItems;

        // Update category if applicable
        if (
          isGroupedByCategory &&
          prevItems[activeIndex].categoryId !== prevItems[overIndex].categoryId
        ) {
          // Update category id
          const updatedActiveItem = {
            ...prevItems[activeIndex],
            categoryId: prevItems[overIndex].categoryId,
          };

          // Create new array and mutate it
          const newItems = [...prevItems];
          newItems[activeIndex] = updatedActiveItem;

          // Reorder array
          return arrayMove(newItems, activeIndex, overIndex);
        }

        return prevItems;
      });
    },
    [isGroupedByCategory],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      // Get active item from both local state and server cache
      const activeItemState = items.find((i) => i.id === active.id);
      const activeItemCache = data?.items.find((i) => i.id === active.id);

      // Cancel if active item is not found
      if (!activeItemState || !activeItemCache) return;

      // Determine if this qualifies as "change"
      // Can be either a change in position or category
      const hasChangedPosition = active.id !== over.id;
      const hasChangedCategory =
        activeItemState.categoryId !== activeItemCache.categoryId;

      // Abort if no changes detected
      if (!hasChangedPosition && !hasChangedCategory) return;

      const activeIndex = items.findIndex((i) => i.id === active.id);
      const overIndex = items.findIndex((i) => i.id === over.id);

      if (activeIndex === -1 || overIndex === -1) return;

      // Move item in array
      const updatedList = arrayMove(items, activeIndex, overIndex);

      const newDisplayOrder = calculateNewDisplayOrder(overIndex, updatedList);

      // Update the moved item's display order
      const movedItem = {
        ...updatedList[overIndex],
        displayOrder: newDisplayOrder,
      };
      updatedList[overIndex] = movedItem;

      // Update local state optimistically
      setItems(updatedList);

      // Call API mutation to persist changes
      reorderItem({
        itemId: movedItem.id,
        data: {
          categoryId: movedItem.categoryId,
          displayOrder: newDisplayOrder,
        },
        updatedList,
      });
    },
    [items, data, reorderItem],
  );

  // Sync local state with cache
  useEffect(() => {
    if (data?.items) {
      setItems(data.items);
    }
  }, [data]);

  if (isPending) {
    return <p>Läser in...</p>; // TODO improve
  }

  if (error) {
    return <p className="text-destructive">{error.message}</p>; // TODO improve
  }

  // Cancel background refetches when dragging starts
  async function handleDragStart() {
    await queryClient.cancelQueries({ queryKey });
  }

  // Refetch/revert cache if dragging is cancelled
  function handleDragCancel() {
    queryClient.invalidateQueries({ queryKey });
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col-reverse justify-between",
        "sm:flex-col sm:justify-start",
      )}
    >
      <ListInput listId={listId} ingredients={ingredients} />
      <DndContext
        collisionDetection={closestCorners}
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <ul className="flex flex-col gap-2 p-2">
          {isGroupedByCategory ? (
            <GroupedList
              listId={listId}
              items={items}
              categories={categories}
            />
          ) : (
            <FlatList listId={listId} items={items} categories={categories} />
          )}
        </ul>
      </DndContext>
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
        <SortableContext
          items={unpurchasedItems}
          strategy={verticalListSortingStrategy}
        >
          <ListGroup className="bg-background" title="Att handla">
            {unpurchasedItems.map((item) => (
              <ListItem
                key={item.id}
                listId={listId}
                item={item}
                categories={categories}
                draggable
              />
            ))}
          </ListGroup>
        </SortableContext>
      )}

      {/* Purchased items */}
      {purchasedItems.length > 0 && (
        <ListGroup title="Handlat">
          {purchasedItems.map((item) => (
            <ListItem
              key={item.id}
              listId={listId}
              item={item}
              categories={categories}
            />
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
      {unpurchasedGroups.map(([name, groupItems]) => (
        <SortableContext
          items={groupItems}
          strategy={verticalListSortingStrategy}
          key={name}
        >
          <ListGroup className="bg-background" title={name}>
            {groupItems.map((item) => (
              <ListItem
                key={item.id}
                listId={listId}
                item={item}
                categories={categories}
                draggable
              />
            ))}
          </ListGroup>
        </SortableContext>
      ))}

      {/* Purchased items */}
      {purchasedItems.length > 0 && (
        <ListGroup title="Handlat">
          {purchasedItems.map((item) => (
            <ListItem
              key={item.id}
              listId={listId}
              item={item}
              categories={categories}
            />
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
    <li
      className={cn(
        "flex flex-col gap-3 rounded-md p-3",
        "animate-in duration-500 fade-in",
        className,
      )}
    >
      {title && <Label>{title.toUpperCase()}</Label>}
      <ul className="flex flex-col gap-2">{children}</ul>
    </li>
  );
}
