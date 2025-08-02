import RecipeListCard from "@/components/recipe-list-card";
import { ProteinType } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
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
  );
}
