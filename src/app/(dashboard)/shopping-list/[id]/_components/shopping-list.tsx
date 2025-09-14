"use client";

import EditItemForm from "@/app/(dashboard)/shopping-list/[id]/_components/edit-item-form";
import ListInput from "@/app/(dashboard)/shopping-list/[id]/_components/list-input";
import ListItem from "@/app/(dashboard)/shopping-list/[id]/_components/list-item";
import ResponsiveDialog from "@/components/responsive-dialog";
import { Label } from "@/components/ui/label";
import {
  useCreateShoppingListItem,
  useUpdateShoppingListItem,
} from "@/hooks/queries/shopping-list/mutations";
import { useShoppingList } from "@/hooks/queries/shopping-list/queries";
import { createId } from "@paralleldrive/cuid2";
import { useState } from "react";

type ShoppingListProps = {
  listId: string;
  categories: { id: string; name: string }[];
};

export default function ShoppingList({
  listId,
  categories,
}: ShoppingListProps) {
  const { data: list, isPending, error } = useShoppingList(listId);
  const { mutate: updateItem } = useUpdateShoppingListItem(listId);
  const { mutate: createItem } = useCreateShoppingListItem(listId);

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  // consider saving last edited item id with a usePrevious hook

  if (isPending) {
    return <p>Läser in...</p>; // TODO improve
  }

  if (error) {
    return <p className="text-destructive">{error.message}</p>; // TODO improve
  }

  const { items } = list;

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col gap-2 p-2">
        <div className="flex flex-col gap-3 rounded-md bg-background p-3">
          <Label>{String("Övrigt").toUpperCase()}</Label>
          <ul className="grid gap-2">
            {items.map((item) => (
              <li key={item.id}>
                <ListItem
                  item={item}
                  onTogglePurchased={(itemId, isPurchased) => {
                    updateItem({ itemId, data: { isPurchased } });
                  }}
                  onEdit={(itemId) => setEditingItemId(itemId)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ListInput
        onCreateItem={(value) =>
          createItem({
            id: createId(),
            name: value,
            quantity: null,
            unit: null,
            displayOrder: null,
            categoryId: null,
          })
        }
      />

      <ResponsiveDialog
        open={!!editingItemId}
        onOpenChange={(open) => {
          if (!open) {
            setEditingItemId(null);
          }
        }}
        // title="Redigera vara"
      >
        {editingItemId && (
          <EditItemForm
            listId={listId}
            itemId={editingItemId}
            categories={categories}
            onOpenChange={(open) => !open && setEditingItemId(null)}
          />
        )}
      </ResponsiveDialog>
    </div>
  );
}
