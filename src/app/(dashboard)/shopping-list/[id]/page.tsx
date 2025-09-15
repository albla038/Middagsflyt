import Header, { BreadcrumbItem } from "@/app/(dashboard)/_components/header";
import ShoppingList from "@/app/(dashboard)/shopping-list/[id]/_components/shopping-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchIngredientCategories } from "@/data/ingredient-category/queries";
import { fetchShoppingList } from "@/data/shopping-list/queries";
import { shoppingListQueryOptions } from "@/hooks/queries/shopping-list/options";
import { getQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { MoreVertical } from "lucide-react";
import { notFound } from "next/navigation";
import { z } from "zod/v4";

const paramsSchema = z.object({ id: z.cuid2() });

export default async function ShoppingListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const validatedId = paramsSchema.safeParse(await params);
  if (!validatedId.success) {
    notFound();
  }
  const { id } = validatedId.data;

  // fetchQuery() instead of prefetch to get access to the data in the server component
  const queryClient = getQueryClient();
  const list = await queryClient.fetchQuery({
    queryKey: shoppingListQueryOptions(id).queryKey,
    queryFn: () => fetchShoppingList(id),
  });

  if (!list) {
    notFound();
  }

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: list.name,
    },
  ];

  const categories = await fetchIngredientCategories();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ScrollArea className="h-full w-full bg-subtle">
        <div className="relative flex h-svh flex-col items-center">
          <Header breadcrumbs={breadcrumbs}>
            {/* // TODO replace with dropdown menu */}
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVertical />
            </Button>
          </Header>
          <main className="relative h-full w-full max-w-lg">
            <ShoppingList listId={id} categories={categories} />
          </main>
        </div>
      </ScrollArea>
    </HydrationBoundary>
  );
}
