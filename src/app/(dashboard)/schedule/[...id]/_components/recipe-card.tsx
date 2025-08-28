"use client";

import AssigneeSelect from "@/app/(dashboard)/schedule/[...id]/_components/assignee-select";
import { rescheduleRecipe } from "@/app/(dashboard)/schedule/[...id]/actions";
import { useSelection } from "@/app/(dashboard)/schedule/[...id]/selection-provider";
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
import H3 from "@/components/ui/typography/h3";
import { HouseholdMember, ScheduledRecipeDisplayContent } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  ClockFading,
  Edit,
  MoreVertical,
  Notebook,
  Trash2,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type RecipeCardProps = {
  scheduledRecipe: ScheduledRecipeDisplayContent;
  householdMembers: HouseholdMember[];
  scheduleId: string;
  isChecked: boolean;
  onEditNote: (scheduledRecipe: ScheduledRecipeDisplayContent) => void;
  onDelete: (scheduledRecipeId: string) => void;
};

export default function RecipeCard({
  scheduledRecipe,
  householdMembers,
  scheduleId,
  isChecked,
  onEditNote,
  onDelete,
}: RecipeCardProps) {
  const { dispatch } = useSelection();

  const {
    id: scheduledRecipeId,
    date,
    servings,
    note,
    recipe,
    assignee,
    createdAt,
  } = scheduledRecipe;

  const { slug, name, totalTimeSeconds, proteinType, recipeType } = recipe;

  async function handleDateChange(daysDifference: number) {
    const state = await rescheduleRecipe({
      scheduledRecipeId: scheduledRecipe.id,
      scheduleId,
      previousDate: date,
      difference: daysDifference,
    });

    if (state) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }

  return (
    <article
      className={cn(
        "flex flex-col gap-2 rounded-md border border-subtle bg-subtle p-3",
        "has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary-foreground",
      )}
    >
      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <Checkbox
          checked={isChecked}
          onCheckedChange={() =>
            dispatch({
              type: "TOGGLE_RECIPE",
              payload: {
                scheduleId,
                scheduledRecipe: {
                  id: scheduledRecipeId,
                  name,
                },
              },
            })
          }
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-5">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" side="right" sideOffset={8}>
            <DropdownMenuGroup>
              {/* Next day action */}
              <DropdownMenuItem onSelect={() => handleDateChange(1)}>
                <ArrowRight />
                Flytta till nästa dag
              </DropdownMenuItem>

              {/* Previous day action */}
              <DropdownMenuItem onSelect={() => handleDateChange(-1)}>
                <ArrowLeft />
                Flytta till föregående dag
              </DropdownMenuItem>

              {/* Edit note action */}
              <DropdownMenuItem
                onSelect={() =>
                  setTimeout(() => onEditNote(scheduledRecipe), 0)
                }
              >
                <Edit />
                Redigera anteckning
              </DropdownMenuItem>

              {/* Remove action */}
              <DropdownMenuItem
                onSelect={() =>
                  setTimeout(() => onDelete(scheduledRecipeId), 0)
                }
              >
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

      {/* Recipe details */}
      <div className="flex flex-col gap-2">
        <Link
          href={`/saved-recipes/${slug}`} // TODO Replace with /[schedule]/[week]/[recipeSlug]
          className={"hover:underline"}
        >
          <H3 className="line-clamp-2 truncate">{name}</H3>
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

        {note && (
          <div className="flex gap-1 text-xs text-muted-foreground">
            <span className="flex h-[1lh] items-center">
              <Notebook className="size-3" />
            </span>
            <p>{note}</p>
          </div>
        )}
      </div>

      <div className="mt-2">
        <AssigneeSelect
          assignee={assignee}
          members={householdMembers}
          scheduledRecipeId={scheduledRecipeId}
          scheduleId={scheduleId}
        />
      </div>
    </article>
  );
}
