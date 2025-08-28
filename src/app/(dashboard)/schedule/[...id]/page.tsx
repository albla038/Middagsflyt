import Header, { BreadcrumbItem } from "@/app/(dashboard)/_components/header";
import WeekdayGrid from "@/app/(dashboard)/schedule/[...id]/_components/weekday-grid";
import { Button } from "@/components/ui/button";
import H1 from "@/components/ui/typography/h1";
import { fetchScheduleAndMembersById } from "@/data/schedule/queries";
import { fetchScheduledNotesByDateRange } from "@/data/scheduled-note/queries";
import { fetchScheduledRecipesByDateRange } from "@/data/scheduled-recipe/queries";
import {
  calculateNextAndPrevWeekNumbers,
  calculateStartAndEndDateOfWeek,
} from "@/lib/utils";
import {
  format,
  getISOWeek,
  getISOWeekYear,
  isSameMonth,
  parse,
  startOfDay,
} from "date-fns";
import { sv } from "date-fns/locale";
import { ArrowLeft, ArrowRight, Utensils } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod/v4";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Get the current date as fallback if no week is provided in the URL
  const today = new Date();
  const startOfToday = startOfDay(today); // This sets the time to 00:00:00
  const currentYearOfToday = getISOWeekYear(startOfToday);
  const currentWeekOfToday = getISOWeek(startOfToday);

  const paramsSchema = z.object({
    id: z.string(),
    year: z.coerce.number().catch(currentYearOfToday),
    week: z.coerce.number().catch(currentWeekOfToday),
  });

  // Parse the params to get the schedule ID, year, and week
  const [rawId, rawYear, rawWeek] = (await params).id;
  const validatedParams = paramsSchema.safeParse({
    id: rawId,
    year: rawYear,
    week: rawWeek,
  });

  if (!validatedParams.success) {
    notFound();
  }

  // Get search param selectedDate
  const selectedDateRaw = (await searchParams).date;
  const selectedDate = Array.isArray(selectedDateRaw)
    ? selectedDateRaw.at(0)
    : selectedDateRaw;

  const { id, year, week } = validatedParams.data;

  // Fetch the schedule by ID to ensure it exists and get its details
  const schedule = await fetchScheduleAndMembersById(id);
  if (!schedule) {
    notFound();
  }

  // Prepare breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: schedule.name,
      href: `/schedule/${id}`,
    },
    {
      label: `Vecka ${week}`,
    },
  ];

  // Get the start and end dates of the week
  const { startDateOfWeek, endDateOfWeek } = calculateStartAndEndDateOfWeek(
    year,
    week,
  );

  const { nextWeek, nextWeekYear, prevWeek, prevWeekYear } =
    calculateNextAndPrevWeekNumbers(startDateOfWeek);

  // Format the date range for display
  const formattedDateRange = isSameMonth(startDateOfWeek, endDateOfWeek)
    ? `${format(startDateOfWeek, "d")} - ${format(endDateOfWeek, "d MMM", { locale: sv })}`
    : `${format(startDateOfWeek, "d MMM", { locale: sv })} - ${format(endDateOfWeek, "d MMM", { locale: sv })}`;

  // Fetch recipes and notes for the specified week
  const recipes = await fetchScheduledRecipesByDateRange(
    id,
    startDateOfWeek,
    endDateOfWeek,
  );
  const notes = await fetchScheduledNotesByDateRange(
    id,
    startDateOfWeek,
    endDateOfWeek,
  );

  const numberOfServings = recipes.reduce((total, recipe) => {
    if (recipe.recipe.recipeType === "HUVUDRÄTT") {
      return total + (recipe.servings || 0);
    } else {
      return total;
    }
  }, 0);

  return (
    <div className="relative flex h-svh w-full flex-col items-center">
      <Header breadcrumbs={breadcrumbs} />

      {/* // TODO Remove max width */}
      <main className="relative grid w-full gap-12 px-2 py-16 xl:max-w-[64rem] 2xl:max-w-[72rem]">
        <div className="flex justify-between">
          <div className="grid gap-2">
            <div className="flex items-center gap-3">
              {/* WeekNavigator buttons */}
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="secondary"
                  size="icon"
                  className="size-7"
                >
                  <Link
                    href={`/schedule/${id}/${prevWeekYear}/${prevWeek}${selectedDate ? `?date=${selectedDate}` : ""}`}
                  >
                    <ArrowLeft />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="icon"
                  className="size-7"
                >
                  <Link
                    href={`/schedule/${id}/${nextWeekYear}/${nextWeek}${selectedDate ? `?date=${selectedDate}` : ""}`}
                  >
                    <ArrowRight />
                  </Link>
                </Button>
              </div>

              <H1>
                Vecka {week}{" "}
                <span className="text-muted-foreground">
                  ({formattedDateRange})
                </span>
              </H1>
            </div>
            <p className="flex items-center gap-1">
              <Utensils className="size-4" />
              <span className="text-lg">
                {numberOfServings}{" "}
                <span className="text-muted-foreground">portioner totalt</span>
              </span>
            </p>
          </div>
        </div>

        <WeekdayGrid
          scheduleId={id}
          householdMembers={schedule.members}
          startDateOfWeek={startDateOfWeek}
          selectedDate={
            selectedDate ? parse(selectedDate, "yyyy-MM-dd", new Date()) : today
          }
          recipes={recipes}
          notes={notes}
        />
      </main>
    </div>
  );
}
