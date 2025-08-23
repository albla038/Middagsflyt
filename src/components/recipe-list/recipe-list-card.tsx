"use client";

import { cn } from "@/lib/utils";
import {
  CalendarClock,
  CalendarPlus,
  ClockFading,
  ListPlus,
  Soup,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import H3 from "@/components/ui/typography/h3";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { MyRecipesDisplay } from "@/lib/types";
import BookmarkToggle from "@/components/recipe/bookmark-toggle";
import StatValueSmall from "@/components/stat-value-small";
import { RecipeDisplayContent } from "@/lib/schemas/recipe";

type RecipeListCardProps = {
  recipe: RecipeDisplayContent;
  basePath: "/saved-recipes" | "/library";
  displayType?: MyRecipesDisplay;
};

export default function RecipeListCard({
  recipe,
  basePath,
  displayType,
}: RecipeListCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  const {
    id,
    name,
    slug,
    recipeYield,
    imageUrl,
    recipeType,
    proteinType,
    totalTimeSeconds,
    isCreatedByUser,
    isImported,
    isSaved,
    scheduledDate,
  } = recipe;

  return (
    <article className="h-full">
      <Card
        className={cn(
          "group gap-0 overflow-hidden border-transparent p-0",
          "transition-all duration-300 hover:border-border hover:bg-subtle", // TODO Image res glitches when scaling
        )}
      >
        <Link href={`${basePath}/${slug}`}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-b-xl bg-accent">
            {imageUrl ? (
              <>
                {isLoading && <Skeleton className="size-full rounded-xl" />}
                <Image
                  src={imageUrl}
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

            {scheduledDate && (
              <div className="absolute top-2 left-2">
                <Badge variant="secondary">
                  <CalendarClock />
                  {scheduledDate.toLocaleDateString("sv-SE", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Badge>
              </div>
            )}
            <ActionButtons
              isSaved={isSaved}
              id={id}
              slug={slug}
              displayType={displayType}
            />
          </div>

          <CardContent className="grid gap-2 pt-3 pb-4 px-4">
            <div className="flex flex-wrap items-center gap-2">
              {proteinType && (
                <Badge variant="secondary">
                  {proteinType.charAt(0) + proteinType.slice(1).toLowerCase()}
                </Badge>
              )}
              <Badge variant="outline">
                {recipeType.charAt(0) + recipeType.slice(1).toLowerCase()}
              </Badge>
              {isImported && isCreatedByUser ? (
                <Badge variant="outline">Importerad av dig</Badge>
              ) : (
                isCreatedByUser && (
                  <Badge variant="outline">Skapad av dig</Badge>
                )
              )}
            </div>
            <div className="grid gap-1">
              <H3 className="truncate">{name}</H3>
              <div className="flex flex-wrap items-center gap-2">
                {totalTimeSeconds && (
                  <StatValueSmall icon={ClockFading} desc="min">
                    {totalTimeSeconds / 60}
                  </StatValueSmall>
                )}
                {recipeYield && (
                  <StatValueSmall icon={Utensils}>{recipeYield}</StatValueSmall>
                )}
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    </article>
  );
}

function ActionButtons({
  displayType,
  isSaved,
  id,
  slug,
}: {
  displayType?: MyRecipesDisplay;
  isSaved: boolean;
  id: string;
  slug: string;
}) {
  return (
    <div className="group absolute top-2 right-2 flex flex-col items-center gap-1">
      {displayType === "created" && (
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <BookmarkToggle
              isBookmarked={isSaved}
              recipeId={id}
              slug={slug}
              variant="default"
              size="icon"
              className={cn(
                { "opacity-0": isSaved },
                "group-hover:opacity-100",
                "group-hover:border-none group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-xs hover:bg-primary/90",
              )}
            />
          </TooltipTrigger>
          <TooltipContent side="left">
            {isSaved ? <p>Ta bort från Sparade recept</p> : <p>Spara recept</p>}
          </TooltipContent>
        </Tooltip>
      )}

      <div
        className={cn(
          "flex flex-col items-center gap-1 opacity-0 transition-opacity duration-200",
          "group-hover:opacity-100",
        )}
      >
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={displayType === "saved" ? "default" : "outline"}
              // TODO add onclick
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              <CalendarPlus />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Planera recept</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              // TODO add onclick
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              <ListPlus />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Lägg i inköpslista</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
