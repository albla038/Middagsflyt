import { queryOptions } from "@tanstack/react-query";
import { fetchShoppingList } from "@/queries/shopping-list/use-shopping-list";

export function shoppingListQueryOptions(listId: string) {
  return queryOptions({
    queryKey: ["shopping-list", listId],
    queryFn: () => fetchShoppingList(listId),
    enabled: !!listId,
  });
}