import Header, { BreadcrumbItem } from "@/app/(dashboard)/_components/header";
import Recipe from "@/components/recipe/recipe";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchRecipeNameBySlug } from "@/data/recipe/queries";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const name = await fetchRecipeNameBySlug(slug);

  if (!name) notFound();

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: "Mina recept",
      href: "/my-recipes",
    },
    {
      label: name,
    },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="relative flex w-full flex-col items-center">
        <Header breadcrumbs={breadcrumbs} />
        <main className="max-w-5xl px-2 py-4 pt-8">
          <Suspense fallback={<p>Läser in recept...</p>}>
            <Recipe slug={slug} />
          </Suspense>
        </main>
      </div>
    </ScrollArea>
  );
}
