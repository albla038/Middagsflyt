import BookmarkToggle from "@/components/recipe/bookmark-toggle";
import CopyLinkButton from "@/components/recipe/copy-link-button";
import RecipeContent from "@/components/recipe/recipe-content";
import RecipeHeader from "@/components/recipe/recipe-header";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
      <RecipeHeader
        recipe={recipe}
        actions={
          <>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="grow"
                  // onClick={() => {}} // TODO Add click handler
                >
                  <CalendarPlus className="size-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Planera recept</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="grow"
                  // onClick={() => {}} // TODO Add click handler
                >
                  <ListPlus className="size-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Lägg till recept i inköpslista</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <BookmarkToggle
                  variant="ghost"
                  size="icon-lg"
                  className="grow"
                  isBookmarked={isBookmarked}
                  recipeId={recipe.id}
                  slug={recipe.slug}
                />
              </TooltipTrigger>
              <TooltipContent>
                {isBookmarked ? (
                  <p>Ta bort från Sparade recept</p>
                ) : (
                  <p>Spara recept</p>
                )}
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <CopyLinkButton
                  variant="icon-lg"
                  slug={recipe.slug}
                  className="grow"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Kopiera länk</p>
              </TooltipContent>
            </Tooltip>
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
          <>
            <BookmarkToggle
              isBookmarked={isBookmarked ?? false}
              recipeId={recipe.id}
              slug={slug}
            />

            <CopyLinkButton slug={slug} />
          </>
        }
      />
    </article>
  );
}
