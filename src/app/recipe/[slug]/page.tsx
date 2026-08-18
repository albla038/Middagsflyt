import AuthActionGuard from "@/components/auth-action-guard";
import IconTooltip from "@/components/icon-tooltip";
import AddToListButton from "@/components/recipe/add-to-list-button";
import BookmarkButton from "@/components/recipe/bookmark-button";
import CopyLinkButton from "@/components/recipe/copy-link-button";
import RecipeContent from "@/components/recipe/recipe-content";
import RecipeHeader from "@/components/recipe/recipe-header";
import ScheduleRecipeButton from "@/components/recipe/schedule-recipe-button";
import { fetchRecipeBySlug } from "@/data/recipe/queries";
import { checkIfRecipeIsSaved } from "@/data/saved-recipe/queries";
import { verifyUser } from "@/data/user/verify-user";
import { notFound } from "next/navigation";

export default async function RecipePage({
  params,
}: PageProps<"/recipe/[slug]">) {
  const { slug } = await params;

  const [recipe, user] = await Promise.all([
    fetchRecipeBySlug(slug),
    verifyUser(),
  ]);

  if (!recipe) notFound();

  let isBookmarked = false;
  if (user) {
    isBookmarked = await checkIfRecipeIsSaved(recipe.id);
  }

  return (
    <article className="flex flex-col gap-8">
      {/* Recipe Header */}
      <RecipeHeader
        recipe={recipe}
        actions={
          <>
            <AuthActionGuard isAuthenticated={!!user}>
              {/* Plan recipe action button */}
              <IconTooltip content={<p>Planera recept</p>}>
                <ScheduleRecipeButton
                  variant="ghost"
                  size="icon-lg"
                  className="grow"
                  recipe={recipe}
                />
              </IconTooltip>

              {/* Add to shopping list action button */}
              <IconTooltip content={<p>Lägg till recept i inköpslista</p>}>
                <AddToListButton
                  variant="ghost"
                  size="icon-lg"
                  className="grow"
                  recipeId={recipe.id}
                />
              </IconTooltip>

              {/* Bookmark action button */}
              <IconTooltip
                content={
                  isBookmarked ? (
                    <p>Ta bort från Sparade recept</p>
                  ) : (
                    <p>Spara recept</p>
                  )
                }
              >
                <BookmarkButton
                  variant="ghost"
                  size="icon-lg"
                  className="grow"
                  isBookmarked={isBookmarked}
                  recipeId={recipe.id}
                />
              </IconTooltip>
            </AuthActionGuard>

            {/* Copy link action button */}
            <IconTooltip content={<p>Kopiera länk</p>}>
              <CopyLinkButton
                variant="ghost"
                size="icon-lg"
                slug={recipe.slug}
                className="grow"
              />
            </IconTooltip>
          </>
        }
      />

      {/* Recipe ingredients and instructions */}
      <RecipeContent
        ingredients={recipe.recipeIngredients}
        instructions={recipe.recipeInstructions}
        recipeYield={recipe.recipeYield}
        ingredientActions={
          <AuthActionGuard isAuthenticated={!!user}>
            <ScheduleRecipeButton recipe={recipe} />

            <AddToListButton variant="secondary" recipeId={recipe.id} />
          </AuthActionGuard>
        }
        instructionActions={
          <>
            <AuthActionGuard isAuthenticated={!!user}>
              <BookmarkButton
                variant="ghost"
                isBookmarked={isBookmarked}
                recipeId={recipe.id}
              />
            </AuthActionGuard>

            <CopyLinkButton variant="ghost" slug={slug} />
          </>
        }
      />
    </article>
  );
}
