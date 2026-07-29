import { getActionErrorMessage } from "@/lib/error-messages";
import { getQueryClient } from "@/lib/query-client";
import { deleteShoppingListItemAction } from "@/queries/shopping-list/actions";
import {
  SHOPPING_LISTS_QUERY_KEY,
  shoppingListQueryOptions,
} from "@/queries/shopping-list/options";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useDeleteShoppingListItem(listId: string) {
  // Get query key from options object
  const queryKey = shoppingListQueryOptions(listId).queryKey;

  return useMutation({
    mutationFn: async (itemId: string) => {
      const response = await deleteShoppingListItemAction({
        listId,
        itemId,
      });

      // Thrown an error if the action fails
      if (!response.success) {
        const errorMessage = getActionErrorMessage(response.errorCode, {
          NOT_FOUND:
            "Varan du försökte ta bort kunde inte hittas. Den kan redan ha tagits bort",
        });
        throw new Error(errorMessage);
      }
    },

    onMutate: async (itemIdToDelete) => {
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous state
      const prevShoppingList = queryClient.getQueryData(queryKey);

      // Update to the new state optimistically
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          items: old.items.filter((item) => item.id !== itemIdToDelete),
        };
      });

      // Return a context object with the snapshotted state
      return { prevShoppingList };
    },

    // If the mutation fails, roll back data
    onError: (err, updatedList, context) => {
      toast.error(err.message);
      queryClient.setQueryData(queryKey, context?.prevShoppingList);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: SHOPPING_LISTS_QUERY_KEY,
      });
    },
  });
}
