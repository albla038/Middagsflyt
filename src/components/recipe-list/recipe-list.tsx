import OrderByToggle from "@/components/recipe-list/order-by-toggle";
import RecipeListCard from "@/components/recipe-list/recipe-list-card";
import SearchBar from "@/components/recipe-list/search-bar";
import SortSelect from "@/components/recipe-list/sort-select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProteinType } from "@/lib/generated/prisma";
import { MyRecipesDisplay, RecipeDisplayContent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Grid2X2, ListFilter, Rows3 } from "lucide-react";

type RecipeListProps = {
  recipes: RecipeDisplayContent[];
  searchQuery?: string;
  displayType?: MyRecipesDisplay;
};

export default function RecipeList({
  recipes,
  searchQuery = "",
  displayType,
}: RecipeListProps) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-2">
        <SearchBar
          placeholder="Sök recept..."
          // className="w-[calc((1/3*100%)-0.5rem)]"
          className="w-sm"
        />
        <div className="flex items-center gap-2">
          <OrderByToggle />

          <Button variant="outline" disabled>
            <ListFilter />
            <span>Filtrera</span>
          </Button>

          <SortSelect />

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
            Inga recept hittades för <strong>&quot;{searchQuery}&quot;</strong>.
          </p>
        ) : (
          <p>Inga recept hittades.</p>
        )
      ) : (
        <ul
          className={cn(
            "grid gap-4",
            "min-[40rem]:grid-cols-2 min-[64rem]:grid-cols-3",
          )}
        >
          {recipes.map((recipe) => (
            <li key={recipe.id} className="list-none">
              <RecipeListCard recipe={recipe} displayType={displayType} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
