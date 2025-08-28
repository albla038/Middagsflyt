"use client";

import { useSelection } from "@/app/(dashboard)/schedule/[...id]/selection-provider";
import { Button } from "@/components/ui/button";
import { ScheduledRecipeDisplayContent } from "@/lib/types";
import { CopyCheck, ListPlus } from "lucide-react";

type ActionButtonsProps = {
  scheduleId: string;
  recipes: ScheduledRecipeDisplayContent[];
};

export default function ActionButtons({
  scheduleId,
  recipes,
}: ActionButtonsProps) {
  const { dispatch } = useSelection();

  return (
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

      <Button>
        <ListPlus /> Lägg i inköpslista
      </Button>
    </div>
  );
}
