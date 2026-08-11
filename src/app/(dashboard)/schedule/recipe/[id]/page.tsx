import Header, { BreadcrumbItem } from "@/app/(dashboard)/_components/header";
import BookmarkButton from "@/components/recipe/bookmark-button";
import CopyLinkButton from "@/components/recipe/copy-link-button";
import RecipeContent from "@/components/recipe/recipe-content";
import RecipeHeader from "@/components/recipe/recipe-header";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fetchScheduledRecipe } from "@/data/scheduled-recipe/queries";
import { stringifyPageSearchParams } from "@/lib/utils";
import { getISOWeek, getISOWeekYear } from "date-fns";
import { CalendarPlus, ListPlus } from "lucide-react";
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
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-lg"
                      className="grow"
                      // onClick={() => {}} // TODO Add click handler
                    >
                      <CalendarPlus />
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
                      <ListPlus />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Lägg till recept i inköpslista</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <BookmarkButton
                      variant="ghost"
                      size="icon-lg"
                      className="grow"
                      isBookmarked={recipe.isSaved}
                      recipeId={recipe.id}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {recipe.isSaved ? (
                      <p>Ta bort från Sparade recept</p>
                    ) : (
                      <p>Spara recept</p>
                    )}
                  </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <CopyLinkButton
                      variant="ghost"
                      size="icon-lg"
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
            initialServings={scheduledRecipe.servings}
            ingredientActions={
              <>
                <Button
                // variant="secondary"
                // onClick={() => {}} // TODO Add click handler
                >
                  <CalendarPlus />
                  <span>Planera</span>
                </Button>

                <Button
                  variant="secondary"
                  // onClick={() => {}} // TODO Add click handler
                >
                  <ListPlus />
                  <span>Lägg i inköpslista</span>
                </Button>
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
