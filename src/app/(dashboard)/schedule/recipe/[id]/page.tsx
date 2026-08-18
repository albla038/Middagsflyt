import Header, { BreadcrumbItem } from "@/app/(dashboard)/_components/header";
import IconTooltip from "@/components/icon-tooltip";
import AddToListButton from "@/components/recipe/add-to-list-button";
import BookmarkButton from "@/components/recipe/bookmark-button";
import CopyLinkButton from "@/components/recipe/copy-link-button";
import RecipeContent from "@/components/recipe/recipe-content";
import RecipeHeader from "@/components/recipe/recipe-header";
import ScheduleRecipeButton from "@/components/recipe/schedule-recipe-button";
import { fetchScheduledRecipe } from "@/data/scheduled-recipe/queries";
import { stringifyPageSearchParams } from "@/lib/utils";
import { getISOWeek, getISOWeekYear } from "date-fns";
import { notFound } from "next/navigation";

export default async function ScheduledRecipePage({
  params,
  searchParams,
}: PageProps<"/schedule/recipe/[id]">) {
  const { id } = await params;

  const scheduledRecipe = await fetchScheduledRecipe(id);
  if (!scheduledRecipe) notFound();

  // Get the ISO week and year for the scheduled recipe date
  const year = getISOWeekYear(scheduledRecipe.date);
  const week = getISOWeek(scheduledRecipe.date);

  const { schedule, recipe } = scheduledRecipe;

  // Bring the date query parameter forward to the breadcrumb links
  const queryParams = await searchParams;
  const queryString = stringifyPageSearchParams({ date: queryParams.date });
  const querySuffix = queryString ? `?${queryString}` : "";

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: schedule.name,
      href: `/schedule/${schedule.id}${querySuffix}`,
    },
    {
      label: `Vecka ${week}`,
      href: `/schedule/${schedule.id}/${year}/${week}${querySuffix}`,
    },
    {
      label: recipe.name,
    },
  ];

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
                    scheduledServings={scheduledRecipe.servings}
                  />
                </IconTooltip>

                {/* Add to shopping list action button */}
                <IconTooltip content={<p>Lägg till recept i inköpslista</p>}>
                  <AddToListButton
                    variant="ghost"
                    size="icon-lg"
                    className="grow"
                    recipeId={recipe.id}
                    scheduledServings={scheduledRecipe.servings}
                  />
                </IconTooltip>

                {/* Bookmark action button */}
                <IconTooltip
                  content={
                    recipe.isSaved ? (
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
                    isBookmarked={recipe.isSaved}
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
            initialServings={scheduledRecipe.servings}
            ingredientActions={
              <>
                <ScheduleRecipeButton
                  recipe={recipe}
                  scheduledServings={scheduledRecipe.servings}
                />

                <AddToListButton
                  variant="secondary"
                  recipeId={recipe.id}
                  scheduledServings={scheduledRecipe.servings}
                />
              </>
            }
            instructionActions={
              <>
                <BookmarkButton
                  variant="ghost"
                  isBookmarked={recipe.isSaved}
                  recipeId={recipe.id}
                />

                <CopyLinkButton variant="ghost" slug={recipe.slug} />
              </>
            }
          />
        </article>
      </main>
    </>
  );
}
