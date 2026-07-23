"use client";

import { addIngredientsToShoppingList } from "@/components/add-to-shopping-list/actions";
import IngredientSelection from "@/components/add-to-shopping-list/ingredient-selection";
import useAllShoppingLists from "@/components/add-to-shopping-list/queries/use-all-shopping-lists";
import { useRecipeIngredients } from "@/components/add-to-shopping-list/queries/use-recipe-ingredients";
import IngredientSkeleton from "@/components/add-to-shopping-list/skeletons/ingredient";
import TargetListSkeleton from "@/components/add-to-shopping-list/skeletons/target-list";
import TargetListSelection from "@/components/add-to-shopping-list/target-list-selection";
import { IngredientSources } from "@/components/add-to-shopping-list/types";
import ResponsiveDialog from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { getActionErrorMessage } from "@/lib/error-messages";
import { AddIngredientToShoppingListInput } from "@/lib/schemas/recipe-ingredient";
import { cn } from "@/lib/utils";
import { useCallback, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

type AddToShoppingListDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredientSources: IngredientSources;
};

export default function AddToShoppingListDialog({
  open,
  onOpenChange,
  ingredientSources,
}: AddToShoppingListDialogProps) {
  const [isPending, startTransition] = useTransition();

  // QUERIES
  // Fetch ingredients for all recipes and scheduled recipes
  const { data: recipeIngredientsSources } = useRecipeIngredients(
    ingredientSources,
    open,
  );

  // Fetch possible shopping list targets
  const { data: shoppingLists } = useAllShoppingLists(open);

  // STATE
  const [step, setStep] = useState<1 | 2>(1);
  const [servingsSelections, setServingsSelections] = useState<
    Record<string, number>
  >({});
  const [uncheckedIngredientIds, setUncheckedIngredientIds] = useState<
    Set<string>
  >(new Set());
  const [targetListId, setTargetListId] = useState<string | null>(null);

  // HANDLERS
  const toggleIngredientSelection = useCallback((id: string) => {
    setUncheckedIngredientIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  }, []);

  const toggleAllSelectionsForRecipe = useCallback(
    (checked: boolean, sourceId: string) => {
      if (!recipeIngredientsSources) return;
      const source = recipeIngredientsSources[sourceId];

      // Get all IDs
      const ids = source.recipeIngredients.map((ing) => ing.recipeIngredientId);

      setUncheckedIngredientIds((prev) => {
        const next = new Set(prev);

        if (checked) {
          ids.forEach((id) => next.delete(id));
        } else {
          ids.forEach((id) => next.add(id));
        }

        return next;
      });
    },
    [recipeIngredientsSources],
  );

  // DERIVED STATE
  const title = step === 1 ? "Välj varor" : "Välj inköpslista";
  const description =
    step === 1
      ? "Välj vilka varor du vill lägga till i en inköpslista"
      : "Välj vilken inköpslista du vill lägga varorna i";

  // Map recipeIngredientsSources to UIRecipeIngredientsSource,
  // with selectedServings and isSelected
  const recipes = useMemo(() => {
    if (!recipeIngredientsSources) return undefined;

    return ingredientSources.ids.map((id) => {
      const source = recipeIngredientsSources[id];
      const { servings, baseServings, ...rest } = source;

      const sourceServings = servings ?? baseServings ?? 4;
      const currentServings = servingsSelections[id] ?? sourceServings;

      return {
        ...rest,
        selectedServings: currentServings,
        servings: sourceServings,
        baseServings,
        recipeIngredients: source.recipeIngredients.map((recipeIng) => ({
          ...recipeIng,
          isSelected: !uncheckedIngredientIds.has(recipeIng.recipeIngredientId),
        })),
      };
    });
  }, [
    recipeIngredientsSources,
    ingredientSources.ids,
    servingsSelections,
    uncheckedIngredientIds,
  ]);

  // Count selected ingredients across all recipes
  const selectedIngredientsCount =
    recipes?.reduce(
      (total, { recipeIngredients }) =>
        total + recipeIngredients.filter((ing) => ing.isSelected).length,
      0,
    ) ?? 0;

  // Main event handler for adding selected ingredients to the target shopping list
  function handleAddToList() {
    if (!targetListId || !recipes) return;

    startTransition(async () => {
      // Map selected ingredients to AddIngredientToShoppingListInput
      const selectedIngredients: AddIngredientToShoppingListInput[] =
        recipes.flatMap((recipe) =>
          recipe.recipeIngredients
            .filter((ing) => ing.isSelected)
            .map(
              ({
                ingredientId,
                displayNamePlural,
                displayNameSingular,
                quantity,
                unit,
                categoryId,
              }) => {
                const name =
                  unit === "ST" && quantity && quantity > 1
                    ? displayNamePlural
                    : displayNameSingular;

                return {
                  ingredientId,
                  name,
                  quantity,
                  unit,
                  categoryId,
                  scheduledRecipeId:
                    recipe.sourceType === "SCHEDULED"
                      ? recipe.sourceId
                      : undefined,
                };
              },
            ),
        );

      const actionRes = await addIngredientsToShoppingList({
        ingredients: selectedIngredients,
        listId: targetListId,
      });

      if (!actionRes.success) {
        const errorMessage = getActionErrorMessage(actionRes.errorCode, {
          NOT_FOUND:
            "Inköpslistan kunde inte hittas. Den kanske ha tagits bort?",
        });

        toast.error(errorMessage);
        return;
      }

      toast.success(
        `${selectedIngredientsCount} varor lades till i ${shoppingLists?.find((list) => list.id === targetListId)?.name ?? "inköpslistan"}`,
      );

      // Close dialog
      onOpenChange(false);
    });
  }

  const stepContent =
    step === 1 ? (
      !recipes ? (
        <IngredientSkeleton />
      ) : (
        <IngredientSelection
          recipes={recipes}
          onToggleIngredient={toggleIngredientSelection}
          onToggleGroup={toggleAllSelectionsForRecipe}
        />
      )
    ) : !shoppingLists ? (
      <TargetListSkeleton />
    ) : (
      <TargetListSelection
        shoppingLists={shoppingLists}
        selectedListId={targetListId}
        onSelectList={(listId) => setTargetListId(listId)}
      />
    );

  return (
    <ResponsiveDialog
      title={title}
      description={description}
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="flex h-[60svh] flex-col md:h-[75svh]">
        {/* Main content */}
        <ScrollArea className="-mr-3 grow overflow-y-auto pr-3">
          {stepContent}
        </ScrollArea>

        {/* Dialog actions */}
        <div
          className={cn(
            "flex flex-col-reverse items-center justify-end gap-2 *:w-full",
            "md:flex-row md:*:w-auto",
          )}
        >
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Stäng
          </Button>
          {step === 1 ? (
            <Button
              onClick={() => setStep(2)}
              disabled={!recipes || recipes.length === 0}
            >
              Nästa
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                Tillbaka
              </Button>
              <Button
                onClick={handleAddToList}
                disabled={!targetListId || isPending}
              >
                {isPending ? (
                  <>
                    <Spinner /> Lägger till varor...
                  </>
                ) : (
                  <>Lägg till {selectedIngredientsCount} varor</>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </ResponsiveDialog>
  );
}
