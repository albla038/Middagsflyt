import Recipe from "@/components/recipe";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main className="px-2 py-4">
      <Suspense fallback={<div>Läser in recept...</div>}>
        <Recipe slug={slug} />
      </Suspense>
    </main>
  );
}
