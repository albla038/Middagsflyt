"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ShoppingListItem } from "@/lib/schemas/shopping-list";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

type ListItemProps = {
  item: ShoppingListItem;
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
    <Label
      className={cn(
        "flex w-full items-center gap-2 text-base font-normal",
        "has-data-[state=checked]:text-muted-foreground",
      )}
    >
      <Checkbox
        checked={isPurchased}
        onCheckedChange={(checked) => {
          if (typeof checked === "boolean") onTogglePurchased(id, checked);
        }}
      />

      <div
        className="flex grow items-center justify-start gap-1"
        onClick={() => onEdit(id)}
      >
        <div className="flex items-center gap-0.5 text-muted-foreground">
          <span>{quantity}</span>
          {unit && unit !== "ST" && <span>{unit.toLocaleLowerCase()}</span>}
        </div>

        <span className="line-clamp-1 truncate">{name}</span>
      </div>

      <div className="flex items-center gap-2 *:size-4">
        {/* // TODO If scheduled indicator */}
        {/* {<CalendarClock />} */}

        <GripVertical className="cursor-move text-muted-foreground/50" />
      </div>
    </Label>
  );
}
