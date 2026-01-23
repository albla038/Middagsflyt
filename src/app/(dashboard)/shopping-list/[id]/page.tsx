import Header, { BreadcrumbItem } from "@/app/(dashboard)/_components/header";
import HeaderMenu from "@/app/(dashboard)/shopping-list/[id]/_components/header-menu";
import ShoppingList from "@/app/(dashboard)/shopping-list/[id]/_components/shopping-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchIngredientCategories } from "@/data/ingredient-category/queries";
import { fetchAllIngredientsWithAlias } from "@/data/ingredient/queries";
import { fetchShoppingList } from "@/data/shopping-list/queries";
import { shoppingListQueryOptions } from "@/queries/shopping-list/options";
import { getQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import z from "zod";

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

  const [categories, ingredients] = await Promise.all([
    fetchIngredientCategories(),
    fetchAllIngredientsWithAlias(),
  ]);

  return (
    <ScrollArea className="h-full w-full bg-subtle">
      <div className="flex h-svh flex-col items-center">
        <Header breadcrumbs={breadcrumbs}>
          <HeaderMenu listId={id} initialItemCount={list.items.length} />
        </Header>
        <main className="w-full max-w-screen grow sm:max-w-lg">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ShoppingList
              listId={id}
              categories={categories}
              ingredients={ingredients}
            />
          </HydrationBoundary>
        </main>
      </div>
    </ScrollArea>
  );
}
