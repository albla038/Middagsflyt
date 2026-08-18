"use client";

import ScheduleRecipeDialog from "@/components/schedule-recipe-dialog/dialog";
import { Button } from "@/components/ui/button";
import { Recipe } from "@/lib/types/recipe";
import { CalendarPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ComponentProps, useState } from "react";
import z from "zod";

type ScheduleRecipeButtonProps = ComponentProps<typeof Button> & {
  recipe: Pick<Recipe, "id" | "name" | "slug" | "recipeYield">;
  scheduledServings?: number | null;
};

export default function ScheduleRecipeButton({
  recipe,
  size,
  scheduledServings,
  ...props
}: ScheduleRecipeButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get servings from query params
  const params = useSearchParams();
  const servings =
    z.coerce
      .number()
      .positive()
      .optional()
      .catch(undefined)
      .parse(params.get("servings")) ??
    scheduledServings ??
    recipe.recipeYield ??
    undefined;

  const isIconOnly = size?.includes("icon") ?? false;

  return (
    <>
      <Button {...props} size={size} onClick={() => setDialogOpen(true)}>
        <CalendarPlus />
        {!isIconOnly && "Planera"}
      </Button>

      <ScheduleRecipeDialog
        key={`${recipe.id}-${servings}`} // Force re-render when servings change
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        recipe={recipe}
        servings={servings ?? 4}
      />
    </>
  );
}
