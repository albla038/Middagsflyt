import { fetchShoppingList } from "@/lib/services/shopping-lists/queries";
import { queryOptions, useQuery } from "@tanstack/react-query";

export function shoppingListQueryOptions(listId: string) {
  return queryOptions({
    queryKey: ["shoppingList", "list", listId],
    queryFn: () => fetchShoppingList(listId),
    enabled: !!listId,
  });
}

export function useShoppingList(listId: string) {
  return useQuery(shoppingListQueryOptions(listId));
}
