"use client";

import StatValueSmall from "@/components/stat-value-small";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Recipe, ScheduledRecipe } from "@/lib/generated/prisma";
import { ClockFading, MoreHorizontal, Utensils } from "lucide-react";

type RecipeCardProps = {
  scheduledRecipe: ScheduledRecipe & {
    recipe: Recipe;
  };
};

export default function RecipeCard({ scheduledRecipe }: RecipeCardProps) {
  const { id: scheduledRecipeId, recipe, servings } = scheduledRecipe;
  const {
    id: recipeId,
    name,
    totalTimeSeconds,
    proteinType,
    recipeType,
  } = recipe;

  return (
    <article className="flex flex-col gap-2 rounded-md bg-subtle p-3">
      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <Checkbox />
        <Button variant="ghost" size="icon" className="size-5">
          <MoreHorizontal className="size-full" />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="line-clamp-2 text-sm font-medium tracking-tight text-pretty">
          {name}
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          {totalTimeSeconds && (
            <StatValueSmall icon={ClockFading} desc="min">
              {totalTimeSeconds / 60}
            </StatValueSmall>
          )}
          {servings && (
            <StatValueSmall icon={Utensils}>{servings}</StatValueSmall>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {proteinType && (
            <Badge variant="outline" className="text-[10px] px-1.5">
              {proteinType.charAt(0) + proteinType.slice(1).toLowerCase()}
            </Badge>
          )}
          <Badge variant="outline" className="text-[10px] px-1.5">
            {recipeType.charAt(0) + recipeType.slice(1).toLowerCase()}
          </Badge>
        </div>
      </div>
    </article>
  );
}
