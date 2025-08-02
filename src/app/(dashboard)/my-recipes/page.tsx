import Header, { BreadcrumbItem } from "@/app/(dashboard)/_components/header";
import { fetchAllSavedRecipes } from "@/data/recipe/queries";
import H1 from "@/components/ui/typography/h1";
import RecipeList, { RecipeDisplayContent } from "@/components/recipe-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: "Mina recept",
  },
];

export default async function Page() {
  const recipes: RecipeDisplayContent[] = await fetchAllSavedRecipes();

  return (
    <div className="relative flex w-full flex-col items-center">
      <Header breadcrumbs={breadcrumbs} />

      <main className="grid max-w-[64rem] gap-12 px-2 py-8">
        <H1>Mina recept</H1>

        <RecipeList recipes={recipes} />
      </main>
    </div>
  );
}
