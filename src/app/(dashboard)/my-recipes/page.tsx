import RecipeListCard from "@/components/recipe-list-card";
import { fetchAllSavedRecipes } from "@/data/recipe/queries";
import { cn } from "@/lib/utils";

export default async function Page() {
  const recipes = await fetchAllSavedRecipes();

  if (recipes.length === 0) {
    return <p>Inga recept hittades.</p>;
  }

  return (
    <main className="max-w-[64rem] px-2 py-4">
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
    </main>
  );
}
