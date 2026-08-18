import Header, { BreadcrumbItem } from "@/app/(dashboard)/_components/header";
import IconTooltip from "@/components/icon-tooltip";
import AddToListButton from "@/components/recipe/add-to-list-button";
import BookmarkButton from "@/components/recipe/bookmark-button";
import CopyLinkButton from "@/components/recipe/copy-link-button";
import RecipeContent from "@/components/recipe/recipe-content";
import RecipeHeader from "@/components/recipe/recipe-header";
import ScheduleRecipeButton from "@/components/recipe/schedule-recipe-button";
import { fetchRecipeForUserBySlug } from "@/data/recipe/queries";
import { notFound } from "next/navigation";

export default async function SavedRecipePage({
  params,
}: PageProps<"/saved-recipes/[slug]">) {
  const { slug } = await params;

  const recipe = await fetchRecipeForUserBySlug(slug);
  if (!recipe) notFound();

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: "Sparade recept",
      href: "/saved-recipes",
    },
    {
      label: recipe.name,
    },
  ];

  const isBookmarked = recipe.isSaved;

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />

      <main className="max-w-5xl px-2 py-4 pt-8">
        <article className="flex flex-col gap-8">
          {/* Recipe Header */}
          <RecipeHeader
            recipe={recipe}
            actions={
              <>
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
              <>
                <ScheduleRecipeButton recipe={recipe} />

                <AddToListButton variant="secondary" recipeId={recipe.id} />
              </>
            }
            instructionActions={
              <>
                <BookmarkButton
                  variant="ghost"
                  isBookmarked={isBookmarked}
                  recipeId={recipe.id}
                />

                <CopyLinkButton variant="ghost" slug={slug} />
              </>
            }
          />
        </article>
      </main>
    </>
  );
}
