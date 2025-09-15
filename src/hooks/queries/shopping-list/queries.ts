import { shoppingListQueryOptions } from "@/hooks/queries/shopping-list/options";
import { useQuery } from "@tanstack/react-query";

export function useShoppingList(listId: string) {
  return useQuery(shoppingListQueryOptions(listId));
}
