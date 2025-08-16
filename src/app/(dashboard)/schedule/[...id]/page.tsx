import { fetchScheduledRecipesByDateRange } from "@/data/scheduled-recipe/queries";
import { groupRecipesByDay } from "@/lib/utils";
import {
  endOfWeek,
  format,
  getISOWeek,
  getISOWeekYear,
  parse,
  startOfDay,
} from "date-fns";
import { sv } from "date-fns/locale";
import { notFound } from "next/navigation";
import { z } from "zod/v4";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string[] }>;
}) {
  const [rawId, rawYear, rawWeek] = (await params).id;

  const today = new Date();
  const startOfToday = startOfDay(today); // This sets the time to 00:00:00
  const currentYear = getISOWeekYear(startOfToday);
  const currentWeek = getISOWeek(startOfToday);

  const paramsSchema = z.object({
    id: z.string(),
    year: z.coerce.number().catch(currentYear),
    week: z.coerce.number().catch(currentWeek),
  });

  const validatedParams = paramsSchema.safeParse({
    id: rawId,
    year: rawYear,
    week: rawWeek,
  });

  if (!validatedParams.success) {
    notFound();
  }

  const { id, year, week } = validatedParams.data;

  // Get the start and end dates of the week
  const startDate = parse(`${year}-${week}-${1}`, "RRRR-II-i", new Date(), {
    locale: sv,
  });
  const endDate = endOfWeek(startDate, { weekStartsOn: 1, locale: sv });

  const recipes = await fetchScheduledRecipesByDateRange(
    id,
    startDate,
    endDate,
  );

  // Transform the recipes into a grid format grouped by day
  const recipesWeekdayGrid = groupRecipesByDay(startDate, recipes);

  return (
    <div className="flex h-svh w-full flex-col items-center">
      <main className="w-full max-w-5xl">
        <p>Id: {validatedParams.data.id}</p>
        <p>Year: {validatedParams.data.year}</p>
        <p>Week: {validatedParams.data.week}</p>
        <br />
        <div className="grid grid-cols-7">
          {[...recipesWeekdayGrid].map(([weekdayKey, groupedRecipes]) => (
            <div key={weekdayKey}>
              <p>
                {format(groupedRecipes.date, "E", {
                  locale: sv,
                }).toUpperCase()}
              </p>
              <p>{format(groupedRecipes.date, "dd")}</p>
              <pre className="overflow-x-scroll">
                {JSON.stringify(groupedRecipes.scheduledRecipes, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
