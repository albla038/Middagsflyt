"use client";

import { useSelection } from "@/app/(dashboard)/schedule/[...slug]/selection-provider";
import AddToShoppingListDialog from "@/components/add-to-shopping-list-dialog/dialog";
import { Button } from "@/components/ui/button";
import { ScheduledRecipeDisplayContent } from "@/lib/types";
import { CopyCheck, ListPlus } from "lucide-react";
import { useState } from "react";

type ActionButtonsProps = {
  scheduleId: string;
  recipes: ScheduledRecipeDisplayContent[];
};

export default function ActionButtons({
  scheduleId,
  recipes,
}: ActionButtonsProps) {
  const { selectionState, dispatch } = useSelection();

  const [addToListDialogOpen, setAddToListDialogOpen] = useState(false);

  const currentSelection = selectionState[scheduleId] ?? [];
  const selectedRecipeIds = currentSelection.map((recipe) => recipe.id);

  return (
    <>
      <div className="flex items-start gap-2">
        {/* <Button variant="ghost" size="icon">
            <WandSparkles />
          </Button> */}
        <Button
          variant="secondary"
          onClick={() =>
            dispatch({
              type: "SELECT_MULTIPLE",
              payload: {
                scheduleId,
                scheduledRecipes: recipes.map((scheduledRecipe) => ({
                  id: scheduledRecipe.id,
                  name: scheduledRecipe.recipe.name,
                })),
              },
            })
          }
        >
          <CopyCheck /> Välj alla
        </Button>

        <Button
          disabled={selectedRecipeIds.length === 0}
          onClick={() => setAddToListDialogOpen(true)}
        >
          <ListPlus /> Lägg i inköpslista
        </Button>
      </div>

      <AddToShoppingListDialog
        open={addToListDialogOpen}
        onOpenChange={setAddToListDialogOpen}
        ingredientSources={{
          type: "scheduled",
          ids: selectedRecipeIds,
        }}
      />
    </>
  );
}
