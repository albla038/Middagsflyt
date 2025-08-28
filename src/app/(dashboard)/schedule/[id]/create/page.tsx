import Header, { BreadcrumbItem } from "@/app/(dashboard)/_components/header";
import ScheduleRecipeForm from "@/app/(dashboard)/schedule/[id]/create/_components/schedule-recipe-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import H1 from "@/components/ui/typography/h1";
import { fetchAllSavedRecipes } from "@/data/recipe/queries";
import { fetchScheduleAndMembersById } from "@/data/schedule/queries";
import { ORDER_OPTIONS, SORT_BY_OPTIONS } from "@/lib/types";
import { format, parse } from "date-fns";
import { CalendarClock, LoaderCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import z from "zod/v4";

const paramsSchema = z.cuid2();

const searchParamsSchema = z.object({
  query: z.string().catch(""),
  order: z.enum(ORDER_OPTIONS).catch("desc"),
  sort: z.enum(SORT_BY_OPTIONS).catch("createdAt"),
  date: z.string().catch(format(new Date(), "yyyy-MM-dd")),
});

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    query: string | string[] | undefined;
    order: string | string[] | undefined;
    sort: string | string[] | undefined;
    date: string | string[] | undefined;
  }>;
}) {
  const validatedId = paramsSchema.safeParse((await params).id);

  if (!validatedId.success) {
    notFound();
  }

  const scheduleId = validatedId.data;

  const {
    query,
    order,
    sort,
    date: selectedDateRaw,
  } = searchParamsSchema.parse(await searchParams);

  const selectedDate = selectedDateRaw
    ? parse(selectedDateRaw, "yyyy-MM-dd", new Date())
    : new Date();

  // Fetch the schedule by ID to ensure it exists and get its details
  const schedule = await fetchScheduleAndMembersById(scheduleId);
  if (!schedule) {
    notFound();
  }

  // Prepare breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: schedule.name,
      href: `/schedule/${scheduleId}`,
    },
    {
      label: "Ny schemaläggning",
    },
  ];

  const recipeData = fetchAllSavedRecipes(query, order, sort);

  return (
    <ScrollArea className="h-full">
      <div className="relative flex w-full flex-col items-center">
        <Header breadcrumbs={breadcrumbs} />

        <main className="grid w-full gap-12 p-16">
          <div className="flex justify-between">
            <H1>
              <CalendarClock />
              Ny schemaläggning
            </H1>
          </div>

          <Suspense
            fallback={
              <div className="flex items-center gap-2">
                <LoaderCircle className="size-4 animate-spin" />
                <p>Läser in recept</p>
              </div>
            }
          >
            <ScheduleRecipeForm
              scheduleId={scheduleId}
              selectedDate={selectedDate}
              recipeData={recipeData}
              searchQuery={query}
              members={schedule.members}
            />
          </Suspense>
        </main>
      </div>
    </ScrollArea>
  );
}
