import { Recipe, ScheduledNote, ScheduledRecipe } from "@/lib/generated/prisma";
import { cn, groupRecipesByWeekday } from "@/lib/utils";
import { format, isSameDay, isToday } from "date-fns";
import { sv } from "date-fns/locale";

type WeekdayGridProps = {
  startDateOfWeek: Date;
  selectedDate: Date;
  recipes: (ScheduledRecipe & {
    recipe: Recipe;
  })[];
  notes: ScheduledNote[];
};

export default function WeekdayGrid({
  startDateOfWeek,
  selectedDate,
  notes,
  recipes,
}: WeekdayGridProps) {
  // Transform the recipes and notes into a grid format grouped by day
  const recipesByWeekday = groupRecipesByWeekday(
    startDateOfWeek,
    recipes,
    notes,
  );

  return (
    <section>
      <ul className="grid grid-cols-7 gap-1">
        {[...recipesByWeekday].map(([weekdayKey, weekday]) => (
          // Day column
          <li
            key={weekdayKey}
            data-today={isToday(weekday.date)}
            data-selected={isSameDay(weekday.date, selectedDate)}
            className="group flex flex-col gap-4"
          >
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
                  "flex size-8 items-center justify-center rounded-md text-lg font-medium",
                  "group-data-[today=true]:bg-accent",
                  "group-data-[selected=true]:!bg-primary group-data-[selected=true]:text-primary-foreground",
                )}
              >
                {format(weekday.date, "dd")}
              </span>
            </h2>
          </li>
        ))}
      </ul>
    </section>
  );
}
