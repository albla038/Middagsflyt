import OrderByToggle from "@/components/recipe-list/order-by-toggle";
import RecipeListCard from "@/components/recipe-list/recipe-list-card";
import SearchBar from "@/components/recipe-list/search-bar";
import SortSelect from "@/components/recipe-list/sort-select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProteinType } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { Grid2X2, ListFilter, LoaderCircle, Rows3 } from "lucide-react";
import { Suspense } from "react";

export type RecipeDisplayContent = {
  id: string;
  name: string;
  slug: string;
  recipeYield: number | null;
  imageUrl: string | null;
  proteinType: ProteinType | null;
  totalTimeSeconds: number | null;
};

type RecipeListProps = RecipeDisplayContent[];

export default async function RecipeList({
  recipes,
}: {
  recipes: RecipeListProps;
}) {
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

      <Suspense
        fallback={
          <div className="flex items-center gap-2">
            <p>Läser in recept</p>
            <LoaderCircle className="size-4 animate-spin" />
          </div>
        }
      >
        {recipes.length === 0 ? (
          <p>Inga recept hittades.</p>
        ) : (
          <ul
            className={cn(
              "grid gap-4",
              "min-[40rem]:grid-cols-2 min-[64rem]:grid-cols-3",
            )}
          >
            {recipes.map((recipe) => (
              <li key={recipe.id} className="list-none">
                <RecipeListCard recipe={recipe} />
              </li>
            ))}
          </ul>
        )}
      </Suspense>
    </div>
  );
}
