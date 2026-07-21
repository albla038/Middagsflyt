import { UIRecipeIngredient } from "@/components/add-to-shopping-list/types";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type IngredientItemProps = {
  item: UIRecipeIngredient;
  onToggle: (id: string) => void;
};

export default function IngredientItem({
  item,
  onToggle,
}: IngredientItemProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2",
        "not-has-data-[state=checked]:text-muted-foreground",
      )}
      htmlFor={`ingredient-checkbox-${item.ingredientId}`}
    >
      <Checkbox
        id={`ingredient-checkbox-${item.ingredientId}`}
        checked={item.isSelected}
        onCheckedChange={() => onToggle(item.recipeIngredientId)}
      />

      <div className="flex min-w-0 grow items-center gap-1 py-1">
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
        <span className="line-clamp-1">
          {item.unit === "ST" && item.quantity && item.quantity > 1
            ? item.displayNamePlural
            : item.displayNameSingular}
        </span>
      </div>
    </label>
  );
}
