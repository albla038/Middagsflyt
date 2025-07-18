import Recipe from "@/components/recipe/recipe";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="max-w-5xl px-2 py-4">
      <Suspense fallback={<div>Läser in recept...</div>}>
        <Recipe slug={slug} />
      </Suspense>
    </main>
  );
}
