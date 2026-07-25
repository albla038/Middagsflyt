import { apiClient } from "@/queries/api-client";
import { fetchShoppingList } from "@/queries/shopping-list/api";
import { queryOptions } from "@tanstack/react-query";

export function shoppingListsQueryOptions() {
  return queryOptions({
    queryKey: ["shopping-lists", "summary"],
    queryFn: () => apiClient("/api/shopping-lists"),
  });
}

export function shoppingListQueryOptions(listId: string) {
  return queryOptions({
    queryKey: ["shopping-lists", listId],
    queryFn: () => fetchShoppingList(listId),
    enabled: !!listId,
  });
}
