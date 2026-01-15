"use client";

import ResponsiveDialog from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useUpdateShoppingListItem,
} from "@/queries/shopping-list/use-update-shopping-list-item";
import { useDeleteShoppingListItem } from "@/queries/shopping-list/use-delete-shopping-list-item";
import { ShoppingListItemResponse } from "@/lib/schemas/shopping-list";
import { cn } from "@/lib/utils";
import { GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import EditItemForm from "./edit-item-form";

type ListItemProps = {
  listId: string;
  item: ShoppingListItemResponse;
  categories: { id: string; name: string }[];
};

export default function ListItem({ listId, item, categories }: ListItemProps) {
  // Edit dialog state
  const [isEditing, setIsEditing] = useState(false);

  // Shopping list item mutations
  const { mutate: updateItem } = useUpdateShoppingListItem(listId);
  const { mutate: deleteItem } = useDeleteShoppingListItem(listId);

  return (
    <>
      <li
        className={cn(
          "flex cursor-pointer items-center gap-2",
          "has-data-[state=checked]:text-muted-foreground",
          "animate-in duration-200 fade-in-0 zoom-in-95",
        )}
      >
        <Checkbox
          className="cursor-pointer"
          checked={item.isPurchased}
          onCheckedChange={(checked) => {
            if (typeof checked === "boolean")
              updateItem({ itemId: item.id, data: { isPurchased: checked } });
          }}
        />

        <div
          className="flex min-w-0 grow items-center justify-start gap-1"
          onClick={() => setIsEditing(true)}
        >
          {item.quantity && (
            <>
              <span className="text-muted-foreground">{item.quantity}</span>
              {item.unit && item.unit !== "ST" && (
                <span className="text-muted-foreground">
                  {item.unit.toLocaleLowerCase()}
                </span>
              )}
            </>
          )}

          <span className="truncate">{item.name}</span>
        </div>

        <div className="flex items-center gap-2 *:size-4">
          {/* // TODO If scheduled indicator */}
          {/* {<CalendarClock />} */}

          <GripVertical className="cursor-move text-muted-foreground/50" />
        </div>
      </li>

      <ResponsiveDialog
        open={isEditing}
        onOpenChange={(open) => setIsEditing(open)}
        title="Redigera vara"
        description="Redigera eller ta bort varan"
        showCloseButtonInDialog={false}
        dialogAction={
          // Delete item action button
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              deleteItem(item.id);
              setIsEditing(false);
            }}
          >
            <Trash2 />
            <span>Ta bort</span>
          </Button>
        }
      >
        <EditItemForm
          listId={listId}
          item={item}
          categories={categories}
          onClose={() => setIsEditing(false)}
        />
      </ResponsiveDialog>
    </>
  );
}
