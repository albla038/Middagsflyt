import { getQueryClient } from "@/lib/query-client";
import {
  ShoppingListItemResponse,
  ShoppingListItemUpdate,
} from "@/lib/schemas/shopping-list";
import { shoppingListQueryOptions } from "@/queries/shopping-list/options";
import { updateShoppingListItem } from "@/queries/shopping-list/use-update-shopping-list-item";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useReorderShoppingListItem(listId: string) {
  const queryKey = shoppingListQueryOptions(listId).queryKey;

  return useMutation({
    mutationFn: ({
      itemId,
      data,
      updatedList,
    }: {
      itemId: string;
      data: ShoppingListItemUpdate;
      updatedList: ShoppingListItemResponse[];
    }) => updateShoppingListItem({ listId, itemId, data }),

    onMutate: async ({ updatedList }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous state
      const prevShoppingList = queryClient.getQueryData(queryKey);

      // Update to the new state optimistically
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          items: updatedList,
        };
      });

      // Return a context object with the snapshotted state
      return { prevShoppingList };
    },

    onError: (error, data, onMutateContext) => {
      toast.error(error.message);
      queryClient.setQueryData(queryKey, onMutateContext?.prevShoppingList);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
}
