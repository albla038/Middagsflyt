import { fetchShoppingList } from "@/queries/shopping-list/api";
import { queryOptions } from "@tanstack/react-query";

export function shoppingListQueryOptions(listId: string) {
  return queryOptions({
    queryKey: ["shopping-list", listId],
    queryFn: () => fetchShoppingList(listId),
    enabled: !!listId,
  });
}