import Header, { BreadcrumbItem } from "@/app/(dashboard)/_components/header";
import { LoaderCircle } from "lucide-react";
import RecipeListCard from "@/components/recipe-list-card";
import { fetchAllSavedRecipes } from "@/data/recipe/queries";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: "Mina recept",
  },
];

export default async function Page() {
  const recipes = await fetchAllSavedRecipes();

  return (
    <div className="relative flex w-full flex-col items-center">
      <Header breadcrumbs={breadcrumbs} />
      <main className="max-w-[64rem] px-2 py-4">
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
      </main>
    </div>
  );
}
