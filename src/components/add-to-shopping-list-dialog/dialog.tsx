"use client";

import { addIngredientsToShoppingList } from "@/components/add-to-shopping-list-dialog/actions";
import IngredientSelection from "@/components/add-to-shopping-list-dialog/ingredient-selection";
import IngredientSkeleton from "@/components/add-to-shopping-list-dialog/skeletons/ingredient";
import TargetListSkeleton from "@/components/add-to-shopping-list-dialog/skeletons/target-list";
import TargetListSelection from "@/components/add-to-shopping-list-dialog/target-list-selection";
import { UIRecipeIngredientsSource } from "@/components/add-to-shopping-list-dialog/types";
import ResponsiveDialog from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { getActionErrorMessage } from "@/lib/error-messages";
import { getQueryClient } from "@/lib/query-client";
import { AddIngredientToShoppingListInput } from "@/lib/schemas/recipe-ingredient";
import { IngredientSources } from "@/lib/types";
import { cn } from "@/lib/utils";
import { recipeIngredientsQueryOptions } from "@/queries/recipes/ingredients/options";
import { shoppingListsQueryOptions } from "@/queries/shopping-list/options";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

const queryClient = getQueryClient();

type AddToShoppingListDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredientSources: IngredientSources;
  initialServings?: number;
};

export default function AddToShoppingListDialog({
  open,
  onOpenChange,
  ingredientSources,
  initialServings,
}: AddToShoppingListDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // QUERIES
  // Fetch ingredients for all recipes and scheduled recipes
  const { data: recipeIngredientsSources } = useQuery({
    ...recipeIngredientsQueryOptions(ingredientSources),
    enabled: open && ingredientSources.ids.length > 0, // Only fetch when dialog is open and there are IDs to fetch
  });

  // Fetch possible shopping list targets
  const { data: shoppingLists } = useQuery({
    ...shoppingListsQueryOptions(),
    enabled: open, // Only fetch when dialog is open
  });

  // STATE
  const [step, setStep] = useState<1 | 2>(1);
  const [uncheckedIngredientIds, setUncheckedIngredientIds] = useState<
    Set<string>
  >(new Set());
  const [targetListId, setTargetListId] = useState<string | null>(null);

  // Set initial servings selections for single recipe sources, if provided.
  const initialSelections = useMemo(
    () =>
      initialServings && ingredientSources.ids.length === 1
        ? { [ingredientSources.ids[0]]: initialServings }
        : {},
    [initialServings, ingredientSources.ids],
  );
  const [servingsSelections, setServingsSelections] =
    useState<Record<string, number>>(initialSelections);

  // DERIVED STATE
  // Map recipeIngredientsSources to UIRecipeIngredientsSource,
  // with selectedServings and isSelected
  const recipes: UIRecipeIngredientsSource[] | undefined = useMemo(() => {
    if (!recipeIngredientsSources) return undefined;

    return ingredientSources.ids.map((id) => {
      const source = recipeIngredientsSources[id];
      const { servings, baseServings, ...rest } = source;

      const sourceServings = baseServings ?? 4;
      const selectedServings =
        servingsSelections[id] ?? servings ?? sourceServings;
      const servingsScale = selectedServings / sourceServings;

      return {
        ...rest,
        selectedServings,
        servings: servings ?? sourceServings,
        baseServings,
        recipeIngredients: source.recipeIngredients.map((recipeIng) => ({
          ...recipeIng,
          quantity: recipeIng.quantity
            ? recipeIng.quantity * servingsScale
            : null,
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
  const selectedIngredientsCount = useMemo(
    () =>
      recipes?.reduce(
        (total, { recipeIngredients }) =>
          total + recipeIngredients.filter((ing) => ing.isSelected).length,
        0,
      ) ?? 0,
    [recipes],
  );

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

  const handleServingsChange = useCallback(
    (sourceId: string, newServings: number) => {
      setServingsSelections((prev) => {
        // If the new servings is the same as the scheduled servings, remove it from the state
        if (
          recipes?.find((recipe) => recipe.sourceId === sourceId)?.servings ===
          newServings
        ) {
          delete prev[sourceId];
          return { ...prev };
        }
        // Otherwise, update the servings for the source
        return {
          ...prev,
          [sourceId]: newServings,
        };
      });
    },
    [recipes],
  );

  const resetState = useCallback(() => {
    setStep(1);
    setServingsSelections(initialSelections);
    setUncheckedIngredientIds(new Set());
    setTargetListId(null);
  }, [initialSelections]);

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

      // Pair scheduled recipes with possible servings updates, if any
      const scheduledRecipeUpdates = recipes
        .filter(
          (recipe) =>
            recipe.sourceType === "SCHEDULED" &&
            servingsSelections[recipe.sourceId] !== undefined,
        )
        .map((recipe) => ({
          id: recipe.sourceId,
          servings: servingsSelections[recipe.sourceId],
        }));

      // Call Server Action
      const actionRes = await addIngredientsToShoppingList({
        ingredients: selectedIngredients,
        listId: targetListId,
        scheduledRecipeUpdates,
      });

      if (!actionRes.success) {
        const errorMessage = getActionErrorMessage(actionRes.errorCode, {
          NOT_FOUND:
            "Inköpslistan kunde inte hittas. Den kanske ha tagits bort?",
        });

        toast.error(errorMessage);
        return;
      }

      toast(
        `${selectedIngredientsCount} varor lades till i ${shoppingLists?.find((list) => list.id === targetListId)?.name ?? "inköpslistan"}`,
        {
          description:
            scheduledRecipeUpdates.length > 0
              ? "Antal portioner uppdaterades för dina schemalagda recept."
              : undefined,
          action: {
            label: "Till inköpslista",
            onClick: () => router.push(`/shopping-list/${targetListId}`),
          },
        },
      );

      // Invalidate query caches
      queryClient.invalidateQueries({
        queryKey: shoppingListsQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: recipeIngredientsQueryOptions(ingredientSources).queryKey,
      });

      // Close dialog
      onOpenChange(false);
    });
  }

  const title =
    step === 1
      ? `Välj varor (${selectedIngredientsCount})`
      : "Välj inköpslista";
  const description =
    step === 1
      ? "Välj vilka varor du vill lägga till i en inköpslista"
      : "Välj vilken inköpslista du vill lägga varorna i";

  const stepContent =
    step === 1 ? (
      !recipes ? (
        <IngredientSkeleton />
      ) : (
        <IngredientSelection
          recipes={recipes}
          onToggleIngredient={toggleIngredientSelection}
          onToggleGroup={toggleAllSelectionsForRecipe}
          onServingsChange={handleServingsChange}
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
      onCloseAnimationEnd={resetState}
    >
      <div className="flex h-[60svh] flex-col md:h-[75svh]">
        {/* Main content */}
        <ScrollArea className="-mr-3 grow overflow-y-auto pr-3">
          <div className="pb-4">{stepContent}</div>
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
