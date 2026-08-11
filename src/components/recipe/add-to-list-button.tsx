"use client";

import AddToShoppingListDialog from "@/app/(dashboard)/_components/add-to-shopping-list-dialog/dialog";
import { Button } from "@/components/ui/button";
import { ListPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ComponentProps, useState } from "react";
import z from "zod";

type AddToListButtonProps = ComponentProps<typeof Button> & {
  recipeId: string;
  scheduledServings?: number | null;
};

export default function AddToListButton({
  recipeId,
  scheduledServings,
  size,
  ...props
}: AddToListButtonProps) {
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
    undefined;

  const isIconOnly = size?.includes("icon") ?? false;

  return (
    <>
      <Button {...props} size={size} onClick={() => setDialogOpen(true)}>
        <ListPlus />
        {!isIconOnly && "Lägg i inköpslista"}
      </Button>

      <AddToShoppingListDialog
        key={`${recipeId}-${servings}`} // Force re-render when servings change
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        ingredientSources={{ type: "recipe", ids: [recipeId] }}
        initialServings={servings}
      />
    </>
  );
}
