import { fetchAllRecipes } from "@/data/recipe/queries";

export default async function RecipeList() {
  const recipeData = await fetchAllRecipes();

  if (recipeData.length === 0) {
    return <p>Inga recept hittades.</p>;
  }

  return (
    <ol className="grid gap-5">
      {recipeData.map((recipe) => (
        <li key={recipe.id} className="max-w-3xl text-sm">
          <h2 className="text-lg font-bold">{recipe.name}</h2>
          <pre className="overflow-x-scroll rounded bg-gray-50 p-4">
            {JSON.stringify(recipe, null, 2)}
          </pre>
        </li>
      ))}
    </ol>
  );
}
