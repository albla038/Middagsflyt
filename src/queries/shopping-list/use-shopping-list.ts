import { useQuery } from "@tanstack/react-query";
import { shoppingListQueryOptions } from "@/queries/shopping-list/options";

export function useShoppingList(listId: string) {
  return useQuery(shoppingListQueryOptions(listId));
}
