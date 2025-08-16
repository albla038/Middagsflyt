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

  const start = parse(`${year}-${week}-${1}`, "RRRR-II-i", new Date(), {
    locale: sv,
  });
  const end = endOfWeek(start, { weekStartsOn: 1, locale: sv });

  console.log(
    "Start of week:",
    format(start, "yyyy-MM-dd'T'HH:mm:ss.SSS", { locale: sv }),
  );
  console.log("Start of week (ISO for DB):", start.toISOString());
  console.log(
    "End of week:",
    format(end, "yyyy-MM-dd'T'HH:mm:ss.SSS", { locale: sv }),
  );
  console.log("End of week (ISO for DB):", end.toISOString());

  return (
    <div>
      <p>Id: {validatedParams.data.id}</p>
      <p>Year: {validatedParams.data.year}</p>
      <p>Week: {validatedParams.data.week}</p>
    </div>
  );
}
