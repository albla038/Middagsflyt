import Header, { BreadcrumbItem } from "@/app/(dashboard)/_components/header";
import {
  fetchAllCreatedRecipes,
  fetchAllSavedRecipes,
  getCreatedRecipesCount,
  getSavedRecipesCount,
} from "@/data/recipe/queries";
import H1 from "@/components/ui/typography/h1";
import RecipeList from "@/components/recipe-list/recipe-list";
import { Button } from "@/components/ui/button";
import { ChefHat, ChevronRight, Database, LoaderCircle, Plus } from "lucide-react";
import { z } from "zod/v4";
import SavedOrCreatedTabs from "@/components/recipe-list/saved-or-created-tabs";
import { Suspense } from "react";
import {
  MY_RECIPES_DISPLAY_OPTIONS,
  ORDER_OPTIONS,
  SORT_BY_OPTIONS,
} from "@/lib/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: "Mina recept",
  },
];

const searchParamsSchema = z.object({
  query: z.string().catch(""),
  order: z.enum(ORDER_OPTIONS).catch("desc"),
  sort: z.enum(SORT_BY_OPTIONS).catch("createdAt"),
  display: z.enum(MY_RECIPES_DISPLAY_OPTIONS).catch("saved"),
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    query: string | string[] | undefined;
    order: string | string[] | undefined;
    sort: string | string[] | undefined;
    display: string | string[] | undefined;
  }>;
}) {
  const { query, order, sort, display } = searchParamsSchema.parse(
    await searchParams,
  );

  const recipes =
    display === "created"
      ? await fetchAllCreatedRecipes(query, order, sort)
      : await fetchAllSavedRecipes(query, order, sort);

  const savedRecipesCount = await getSavedRecipesCount(query);
  const createdRecipesCount = await getCreatedRecipesCount(query);

  return (
    <ScrollArea className="h-full">
      <div className="relative flex w-full flex-col items-center">
        <Header breadcrumbs={breadcrumbs} />

        <main className="grid w-full max-w-[64rem] gap-12 px-2 py-16">
          <div className="flex justify-between">
            <H1>
              <ChefHat />
              Mina recept
            </H1>
            <div className="flex items-start gap-2">
              <SavedOrCreatedTabs
                savedCount={savedRecipesCount}
                createdCount={createdRecipesCount}
              />

              <Button disabled>
                <Plus />
                <span>Lägg till recept</span>
              </Button>
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
              displayType={display}
            />
          </Suspense>

          <Button variant="ghost" className="group mx-auto" asChild>
            <Link href={"/library"}>
              <Database />
              <span>Utforska fler recept i biblioteket</span>
              <ChevronRight
                className={cn(
                  "mr-0.5 transition-all",
                  "group-hover:mr-0 group-hover:ml-0.5",
                )}
              />
            </Link>
          </Button>
        </main>
      </div>
    </ScrollArea>
  );
}
