import { fetchShoppingList } from "@/lib/services/shopping-lists/queries";
import { queryOptions } from "@tanstack/react-query";

export function shoppingListQueryOptions(listId: string) {
  return queryOptions({
    // queryKey: shoppingListKeys.list(listId),
    queryKey: ["shopping-list", listId],
    queryFn: () => fetchShoppingList(listId),
    enabled: !!listId,
  });
}
