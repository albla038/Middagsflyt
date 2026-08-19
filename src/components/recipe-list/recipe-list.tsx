"use client";

import AddToShoppingListDialog from "@/components/add-to-shopping-list-dialog/dialog";
import OrderByToggle from "@/components/recipe-list/order-by-toggle";
import RecipeListCard from "@/components/recipe-list/recipe-list-card";
import SearchBar from "@/components/recipe-list/search-bar";
import SortSelect from "@/components/recipe-list/sort-select";
import ScheduleRecipeDialog from "@/components/schedule-recipe-dialog/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeCardDisplayContent } from "@/lib/schemas/recipe";
import { MyRecipesDisplay } from "@/lib/types";
import { Grid2X2, ListFilter, Rows3 } from "lucide-react";
import { Suspense, use, useMemo, useState } from "react";

type RecipeListProps = {
  recipesPromise: Promise<RecipeCardDisplayContent[]>;
  basePath: "/saved-recipes" | "/library";
  searchQuery?: string;
  displayType?: MyRecipesDisplay;
};

export default function RecipeList({
  recipesPromise,
  basePath,
  searchQuery = "",
  displayType,
}: RecipeListProps) {
  const [addToListDialogOpen, setAddToListDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const recipes = use(recipesPromise);

  const selectedRecipe = useMemo(
    () => recipes.find((recipe) => recipe.id === selectedRecipeId),
    [recipes, selectedRecipeId],
  );

  return (
    <>
      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-2">
          <Suspense>
            <SearchBar
              placeholder="Sök recept..."
              // className="w-[calc((1/3*100%)-0.5rem)]"
              className="w-sm"
            />
          </Suspense>
          <div className="flex items-center gap-2">
            <Suspense>
              <OrderByToggle />
            </Suspense>

            <Button variant="outline" disabled>
              <ListFilter />
              <span>Filtrera</span>
            </Button>

            <Suspense>
              <SortSelect />
            </Suspense>

            <Tabs defaultValue="grid">
              <TabsList>
                <TabsTrigger value="list" disabled>
                  {/* // TODO enable when list view is implemented */}
                  <Rows3 />
                </TabsTrigger>
                <TabsTrigger value="grid">
                  <Grid2X2 />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {recipes.length === 0 ? (
          searchQuery ? (
            <p>
              Inga recept hittades för{" "}
              <strong>&quot;{searchQuery}&quot;</strong>.
            </p>
          ) : (
            <p>Inga recept hittades.</p>
          )
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <li key={recipe.id} className="list-none">
                <RecipeListCard
                  recipe={recipe}
                  basePath={basePath}
                  displayType={displayType}
                  onClickSchedule={(recipeId) => {
                    setSelectedRecipeId(recipeId);
                    setScheduleDialogOpen(true);
                  }}
                  onClickAddToList={(recipeId) => {
                    setSelectedRecipeId(recipeId);
                    setAddToListDialogOpen(true);
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <AddToShoppingListDialog
        open={addToListDialogOpen}
        onOpenChange={setAddToListDialogOpen}
        ingredientSources={{
          type: "recipe",
          ids: selectedRecipeId ? [selectedRecipeId] : [],
        }}
      />

      {selectedRecipe && (
        <ScheduleRecipeDialog
          open={scheduleDialogOpen}
          onOpenChange={(open) => {
            setScheduleDialogOpen(open);
            if (!open) {
              setSelectedRecipeId(null);
            }
          }}
          recipe={selectedRecipe}
          servings={selectedRecipe.recipeYield ?? 4}
        />
      )}
    </>
  );
}
