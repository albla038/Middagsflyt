import Header, { BreadcrumbItem } from "@/app/(dashboard)/_components/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import H1 from "@/components/ui/typography/h1";
import { ChefHat } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: "Mina recept",
  },
];

export default function MyRecipesPage() {
  return (
    <ScrollArea className="h-full">
      <div className="relative flex flex-col items-center">
        <Header breadcrumbs={breadcrumbs} />

        <main className="grid w-full max-w-5xl gap-12 px-2 py-16">
          <div className="flex justify-between">
            <H1>
              <ChefHat />
              Mina recept
            </H1>
          </div>
        </main>
      </div>
    </ScrollArea>
  );
}
