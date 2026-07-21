import { UIRecipeIngredientsSource } from "@/components/add-to-shopping-list/types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

type IngredientGroupProps = {
  recipe: UIRecipeIngredientsSource;
  onToggleGroup: (checked: boolean, sourceId: string) => void;
  children: ReactNode;
};

export default function IngredientGroup({
  recipe,
  onToggleGroup,
  children,
}: IngredientGroupProps) {
  const allChecked = recipe.recipeIngredients.every(
    (ingredient) => ingredient.isSelected,
  );

  const allUnchecked = recipe.recipeIngredients.every(
    (ingredient) => !ingredient.isSelected,
  );

  const checkedState: CheckedState = allChecked
    ? true
    : allUnchecked
      ? false
      : "indeterminate";

  return (
    <Collapsible className="group/collapsible">
      <div className="space-y-2 p-1">
        <div className="flex w-full items-center gap-2">
          <Checkbox
            checked={checkedState}
            onCheckedChange={(checked) => {
              if (typeof checked === "boolean")
                onToggleGroup(checked, recipe.sourceId);
            }}
          />
          <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between">
            <span className="line-clamp-1 grow text-left leading-none font-medium">
              {recipe.name}
            </span>
            <ChevronRight className="size-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pl-6">{children}</CollapsibleContent>
      </div>
    </Collapsible>
  );
}
