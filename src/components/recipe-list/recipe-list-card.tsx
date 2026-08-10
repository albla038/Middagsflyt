"use client";

import { cn } from "@/lib/utils";
import { CalendarClock, ClockFading, Soup, Utensils } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import H3 from "@/components/ui/typography/h3";
import { Skeleton } from "@/components/ui/skeleton";
import { MyRecipesDisplay } from "@/lib/types";
import StatValueSmall from "@/components/stat-value-small";
import { RecipeDisplayContent } from "@/lib/schemas/recipe";
import CardActionButtons from "@/components/recipe-list/card-action-buttons";

type RecipeListCardProps = {
  recipe: RecipeDisplayContent;
  basePath: "/saved-recipes" | "/library";
  displayType?: MyRecipesDisplay;
  onClickSchedule: (recipeId: string) => void;
  onClickAddToList: (recipeId: string) => void;
};

export default function RecipeListCard({
  recipe,
  basePath,
  displayType,
  onClickSchedule,
  onClickAddToList,
}: RecipeListCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <article className="h-full">
      <Card
        className={cn(
          "group gap-0 overflow-hidden border-transparent p-0",
          "transition-all duration-300 hover:border-border hover:bg-subtle", // TODO Image res glitches when scaling
        )}
      >
        <Link href={`${basePath}/${recipe.slug}`}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-b-xl bg-accent">
            {recipe.imageUrl ? (
              <>
                {isLoading && <Skeleton className="size-full rounded-xl" />}
                <Image
                  src={recipe.imageUrl}
                  alt="Receptbild"
                  width={1000}
                  height={750}
                  className={cn(
                    "size-full object-cover transition-opacity duration-500",
                    isLoading ? "opacity-0" : "opacity-100",
                  )}
                  onLoad={() => setIsLoading(false)}
                  priority
                />
              </>
            ) : (
              <div className="flex size-full items-center justify-center rounded-xl bg-muted">
                <Soup className="size-8 text-muted-foreground" />
              </div>
            )}

            {/* // Show scheduled date if the recipe is scheduled in the future */}
            {recipe.scheduledDates && (
              <div className="absolute top-2 left-2">
                {recipe.scheduledDates.map((date) => (
                  <li key={date.toISOString()}>
                    <Badge variant="secondary" className="w-full">
                      <CalendarClock />
                      {date.toLocaleDateString("sv-SE", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </Badge>
                  </li>
                ))}
              </div>
            )}

            <CardActionButtons
              isSaved={recipe.isSaved}
              id={recipe.id}
              displayType={displayType}
              onClickSchedule={() => onClickSchedule(recipe.id)}
              onClickAddToList={() => onClickAddToList(recipe.id)}
            />
          </div>

          <CardContent className="grid gap-2 px-4 pt-3 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              {recipe.proteinType && (
                <Badge variant="secondary">
                  {recipe.proteinType.charAt(0) +
                    recipe.proteinType.slice(1).toLowerCase()}
                </Badge>
              )}
              <Badge variant="outline">
                {recipe.recipeType.charAt(0) +
                  recipe.recipeType.slice(1).toLowerCase()}
              </Badge>
              {recipe.isImported && recipe.isCreatedByUser ? (
                <Badge variant="outline">Importerad av dig</Badge>
              ) : (
                recipe.isCreatedByUser && (
                  <Badge variant="outline">Skapad av dig</Badge>
                )
              )}
            </div>
            <div className="grid gap-1">
              <H3 className="">{recipe.name}</H3>
              <div className="flex flex-wrap items-center gap-2">
                {recipe.totalTimeSeconds && (
                  <StatValueSmall icon={ClockFading} desc="min">
                    {recipe.totalTimeSeconds / 60}
                  </StatValueSmall>
                )}
                {recipe.recipeYield && (
                  <StatValueSmall icon={Utensils}>
                    {recipe.recipeYield}
                  </StatValueSmall>
                )}
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    </article>
  );
}
