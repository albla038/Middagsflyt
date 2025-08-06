import Header, { BreadcrumbItem } from "@/app/(dashboard)/_components/header";
import { fetchAllRecipesForUser } from "@/data/recipe/queries";
import H1 from "@/components/ui/typography/h1";
import RecipeList from "@/components/recipe-list/recipe-list";
import { Database, LoaderCircle } from "lucide-react";
import { z } from "zod/v4";
import { Suspense } from "react";
import { ORDER_OPTIONS, SORT_BY_OPTIONS } from "@/lib/types";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: "Receptbibliotek",
  },
];

const searchParamsSchema = z.object({
  query: z.string().catch(""),
  order: z.enum(ORDER_OPTIONS).catch("desc"),
  sort: z.enum(SORT_BY_OPTIONS).catch("createdAt"),
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    query: string | string[] | undefined;
    order: string | string[] | undefined;
    sort: string | string[] | undefined;
  }>;
}) {
  const { query, order, sort } = searchParamsSchema.parse(await searchParams);

  const recipes = await fetchAllRecipesForUser(query, order, sort);
  const recipeCount = recipes.length;

  return (
    <ScrollArea className="h-full">
      <div className="relative flex w-full flex-col items-center">
        <Header breadcrumbs={breadcrumbs} />

        <main className="grid w-full max-w-[64rem] gap-12 px-2 py-16">
          <div className="flex justify-between">
            <div className="flex items-start gap-2">
              <H1>
                <Database />
                Receptbibliotek
              </H1>
              <Badge variant="outline" className="mt-1">{recipeCount}</Badge>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="flex items-center gap-2">
                <p>Läser in recept</p>
                <LoaderCircle className="size-4 animate-spin" />
              </div>
            }
          >
            <RecipeList
              recipes={recipes}
              searchQuery={query}
              displayType={"created"}
            />
          </Suspense>
        </main>
      </div>
    </ScrollArea>
  );
}
