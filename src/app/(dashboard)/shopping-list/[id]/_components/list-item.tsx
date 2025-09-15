"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingListItemResponse } from "@/lib/schemas/shopping-list";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

type ListItemProps = {
  item: ShoppingListItemResponse;
  onTogglePurchased: (itemId: string, isPurchased: boolean) => void;
  onEdit: (itemId: string) => void;
};

export default function ListItem({
  item,
  onTogglePurchased,
  onEdit,
}: ListItemProps) {
  const { id, name, quantity, unit, isPurchased } = item;

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-2",
        "has-data-[state=checked]:text-muted-foreground",
      )}
    >
      <Checkbox
        className="cursor-pointer"
        checked={isPurchased}
        onCheckedChange={(checked) => {
          if (typeof checked === "boolean") onTogglePurchased(id, checked);
        }}
      />

      <div
        className="flex grow items-center justify-start gap-1"
        onClick={() => onEdit(id)}
      >
        {quantity && (
          <>
            <span className="text-muted-foreground">{quantity}</span>
            {unit && unit !== "ST" && (
              <span className="text-muted-foreground">
                {unit.toLocaleLowerCase()}
              </span>
            )}
          </>
        )}

        <span className="line-clamp-1 truncate">{name}</span>
      </div>

      <div className="flex items-center gap-2 *:size-4">
        {/* // TODO If scheduled indicator */}
        {/* {<CalendarClock />} */}

        <GripVertical className="cursor-move text-muted-foreground/50" />
      </div>
    </div>
  );
}
