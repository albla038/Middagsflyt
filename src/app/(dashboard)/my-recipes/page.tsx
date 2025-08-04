import Header, { BreadcrumbItem } from "@/app/(dashboard)/_components/header";
import {
  fetchAllCreatedRecipes,
  fetchAllSavedRecipes,
} from "@/data/recipe/queries";
import H1 from "@/components/ui/typography/h1";
import RecipeList, { RecipeDisplayContent } from "@/components/recipe-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: "Mina recept",
  },
];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = (await searchParams).query;
  const searchQuery = Array.isArray(query) ? query[0] : query || "";
  console.log("Search query:", searchQuery);

  const savedRecipes: RecipeDisplayContent[] =
    await fetchAllSavedRecipes(searchQuery);
  const createdRecipes: RecipeDisplayContent[] = await fetchAllCreatedRecipes();

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
