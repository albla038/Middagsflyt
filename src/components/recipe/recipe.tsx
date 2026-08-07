import BookmarkToggle from "@/components/recipe/bookmark-toggle";
import RecipeContent from "@/components/recipe/recipe-content";
import RecipeHeader from "@/components/recipe/recipe-header";
import { Button } from "@/components/ui/button";
import { fetchRecipeBySlug } from "@/data/recipe/queries";
import { checkIfRecipeIsSaved } from "@/data/saved-recipe/queries";
import { verifyUser } from "@/data/user/verify-user";
import { CalendarPlus, ListPlus } from "lucide-react";
import { notFound } from "next/navigation";

export default async function Recipe({ slug }: { slug: string }) {
  const recipe = await fetchRecipeBySlug(slug);

  if (!recipe) notFound();

  let isBookmarked = false;
  const user = await verifyUser();
  if (user) {
    isBookmarked = await checkIfRecipeIsSaved(recipe.id);
  }

  return (
    <article className="flex flex-col gap-8">
      {/* Recipe Header */}
      <RecipeHeader recipe={recipe} isBookmarked={isBookmarked} />

      {/* Recipe ingredients and instructions */}
      <RecipeContent
        ingredients={recipe.recipeIngredients}
        instructions={recipe.recipeInstructions}
        recipeYield={recipe.recipeYield}
        slug={slug}
        ingredientActions={
          <>
            <Button
            // onClick={() => {}} // TODO Add click handler
            >
              <CalendarPlus />
              <span>Planera</span>
            </Button>
            <Button
              variant={"secondary"}
              // onClick={() => {}} // TODO Add click handler
            >
              <ListPlus />
              <span>Lägg i inköpslista</span>
            </Button>
          </>
        }
        instructionActions={
          <BookmarkToggle
            isBookmarked={isBookmarked ?? false}
            recipeId={recipe.id}
            slug={slug}
          />
        }
      />
    </article>
  );
}
