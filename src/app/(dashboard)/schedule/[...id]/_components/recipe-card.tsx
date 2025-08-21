"use client";

import StatValueSmall from "@/components/stat-value-small";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScheduledRecipeDisplayContent } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ClockFading,
  Edit,
  MoreHorizontal,
  Notebook,
  Trash2,
  Utensils,
} from "lucide-react";
import Link from "next/link";

type RecipeCardProps = {
  scheduledRecipe: ScheduledRecipeDisplayContent;
};

export default function RecipeCard({ scheduledRecipe }: RecipeCardProps) {
  const {
    id: scheduledRecipeId,
    date,
    servings,
    note,
    recipe,
    assignee,
    createdAt,
  } = scheduledRecipe;

  const {
    id: recipeId,
    slug,
    name,
    totalTimeSeconds,
    proteinType,
    recipeType,
  } = recipe;

  return (
    <article
      className={cn(
        "flex flex-col gap-2 rounded-md border border-subtle bg-subtle p-3",
        "has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary-foreground",
      )}
    >
      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <Checkbox />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-5">
              <MoreHorizontal className="size-full" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" side="right" sideOffset={8}>
            <DropdownMenuGroup>
              {/* // TODO Add action */}
              <DropdownMenuItem>
                <Edit />
                Redigera
              </DropdownMenuItem>

              {/* // TODO Add action */}
              <DropdownMenuItem>
                <Trash2 className="text-destructive" />
                Ta bort
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>
                Skapad{" "}
                {createdAt.toLocaleString("sv-SE", {
                  dateStyle: "medium",
                })}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-2">
        <Link
          href={`/saved-recipes/${slug}`} // TODO Replace with /[schedule]/[week]/[recipeSlug]
          className={"hover:underline"}
        >
          <h3
            className={
              "line-clamp-2 text-base font-medium tracking-tight text-pretty"
            }
          >
            {name}
          </h3>
        </Link>

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

        {note && (
          <div className="flex gap-1 text-xs text-muted-foreground">
            <span className="flex h-[1lh] items-center">
              <Notebook className="size-3" />
            </span>
            <p>{note}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {proteinType && (
            <Badge variant="outline">
              {proteinType.charAt(0) + proteinType.slice(1).toLowerCase()}
            </Badge>
          )}
          <Badge variant="outline">
            {recipeType.charAt(0) + recipeType.slice(1).toLowerCase()}
          </Badge>
        </div>
      </div>
    </article>
  );
}
