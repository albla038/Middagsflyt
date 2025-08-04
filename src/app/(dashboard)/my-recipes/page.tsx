import Header, { BreadcrumbItem } from "@/app/(dashboard)/_components/header";
import {
  fetchAllCreatedRecipes,
  fetchAllSavedRecipes,
  ORDER_OPTIONS,
  SORT_BY_OPTIONS,
} from "@/data/recipe/queries";
import H1 from "@/components/ui/typography/h1";
import RecipeList, {
  RecipeDisplayContent,
} from "@/components/recipe-list/recipe-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { z } from "zod/v4";

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: "Mina recept",
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

  const savedRecipes: RecipeDisplayContent[] = await fetchAllSavedRecipes(
    query,
    order,
    sort,
  );
  const createdRecipes: RecipeDisplayContent[] = await fetchAllCreatedRecipes(
    query,
    order,
    sort,
  );

  return (
    <div className="relative flex w-full flex-col items-center">
      <Header breadcrumbs={breadcrumbs} />

      <main className="grid max-w-[64rem] gap-12 px-2 py-16">
        <div className="flex justify-between">
          <H1>Mina recept</H1>
          <div className="flex items-start gap-2">
            {/* // TODO Hide tabs in drawer to the left */}
            {/* <Tabs defaultValue="saved">
              <TabsList>
                <TabsTrigger value="saved">
                  <span>Sparade</span>
                  <Badge variant="outline">{savedRecipes.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="created">
                  <span>Importerade/skapade</span>
                  <Badge variant="outline">{createdRecipes.length}</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs> */}
            <Button disabled>
              <Plus />
              <span>Lägg till recept</span>
            </Button>
          </div>
        </div>

        <RecipeList recipes={savedRecipes} />
      </main>
    </div>
  );
}
