"use client";

import AddButton from "@/app/(dashboard)/schedule/[...id]/_components/add-button";
import DeleteNoteAlert, {
  DeleteNoteAlertState,
} from "@/app/(dashboard)/schedule/[...id]/_components/delete-note-alert";
import NoteCard from "@/app/(dashboard)/schedule/[...id]/_components/note-card";
import RecipeCard from "@/app/(dashboard)/schedule/[...id]/_components/recipe-card";
import SaveNoteDialog, {
  SaveNoteDialogState,
} from "@/app/(dashboard)/schedule/[...id]/_components/save-note-dialog";
import {
  HouseholdMember,
  ScheduledNoteDisplayContent,
  ScheduledRecipeDisplayContent,
} from "@/lib/types";
import { cn, groupRecipesByWeekday } from "@/lib/utils";
import { format, isSameDay, isToday } from "date-fns";
import { sv } from "date-fns/locale";
import { useState } from "react";

type WeekdayGridProps = {
  scheduleId: string;
  startDateOfWeek: Date;
  selectedDate: Date;
  recipes: ScheduledRecipeDisplayContent[];
  notes: ScheduledNoteDisplayContent[];
  householdMembers: HouseholdMember[];
};

export default function WeekdayGrid({
  scheduleId,
  startDateOfWeek,
  selectedDate,
  recipes,
  notes,
  householdMembers,
}: WeekdayGridProps) {
  // Transform the recipes and notes into a grid format grouped by day
  const recipesByWeekday = groupRecipesByWeekday(
    startDateOfWeek,
    recipes,
    notes,
  );

  // State for the dialogs
  const [saveNoteDialogState, setSaveNoteDialogState] =
    useState<SaveNoteDialogState>({
      mode: "CLOSED",
    });
  const [deleteNoteAlertState, setDeleteNoteAlertState] =
    useState<DeleteNoteAlertState>({ mode: "CLOSED" });

  return (
    <section>
      <ul className="grid grid-cols-7 gap-1">
        {[...recipesByWeekday].map(([weekdayKey, weekday]) => (
          // Day column
          <li
            key={weekdayKey}
            data-today={isToday(weekday.date)}
            data-selected={isSameDay(weekday.date, selectedDate)}
            className="group flex flex-col items-center gap-4"
          >
            {/* Day header */}
            <h2 className="flex h-14 flex-col items-center justify-between text-center">
              <span
                className={"text-xs group-data-[selected=true]:text-primary"}
              >
                {format(weekday.date, "E", {
                  locale: sv,
                }).toUpperCase()}
              </span>

              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-md text-lg font-medium",
                  "group-data-[today=true]:bg-accent",
                  "group-data-[selected=true]:!bg-primary group-data-[selected=true]:text-primary-foreground",
                )}
              >
                {format(weekday.date, "d")}
              </span>
            </h2>

            {/* Recipes for the day */}
            {weekday.recipes.length > 0 && (
              <ul className="flex w-full flex-col gap-2">
                {weekday.recipes.map((recipe) => (
                  <li key={recipe.id}>
                    <RecipeCard
                      scheduledRecipe={recipe}
                      householdMembers={householdMembers}
                      scheduleId={scheduleId}
                    />
                  </li>
                ))}
              </ul>
            )}

            {/* Notes for the day */}
            {weekday.notes.length > 0 && (
              <ul className="flex w-full flex-col gap-2">
                {weekday.notes.map((note) => (
                  <li key={note.id}>
                    <NoteCard
                      note={note}
                      onEdit={(editedNote) =>
                        setSaveNoteDialogState({
                          mode: "EDIT",
                          note: editedNote,
                        })
                      }
                      onDelete={(noteId) =>
                        setDeleteNoteAlertState({ mode: "OPEN", noteId })
                      }
                    />
                  </li>
                ))}
              </ul>
            )}

            <AddButton
              onAddRecipe={() => {
                return; // TODO open dialog to add recipe
              }}
              onAddNote={() =>
                setSaveNoteDialogState({
                  mode: "CREATE",
                  note: {
                    date: weekday.date,
                  },
                })
              }
            />
          </li>
        ))}
      </ul>

      <SaveNoteDialog
        scheduleId={scheduleId}
        dialogState={saveNoteDialogState}
        setDialogState={setSaveNoteDialogState}
      />

      <DeleteNoteAlert
        scheduleId={scheduleId}
        alertState={deleteNoteAlertState}
        setAlertState={setDeleteNoteAlertState}
      />
    </section>
  );
}
