import Recipe from "@/components/recipe/recipe";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="max-w-5xl px-2 py-4 pt-8">
      <Suspense fallback={<p>Läser in recept...</p>}>
        <Recipe slug={slug} />
      </Suspense>
    </main>
  );
}
