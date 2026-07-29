import { apiClient } from "@/queries/api-client";
import { queryOptions } from "@tanstack/react-query";

export const SHOPPING_LISTS_QUERY_KEY = ["shopping-lists"] as const;

export function shoppingListsQueryOptions() {
  return queryOptions({
    queryKey: [...SHOPPING_LISTS_QUERY_KEY, "summary"],
    queryFn: () => apiClient("/api/shopping-lists"),
  });
}

export function shoppingListQueryOptions(listId: string) {
  return queryOptions({
    queryKey: [...SHOPPING_LISTS_QUERY_KEY, listId],
    queryFn: () =>
      apiClient(`/api/shopping-lists/:listId`, { params: { listId } }),
    enabled: !!listId,
  });
}
