import {
  SHOPPING_LISTS_QUERY_KEY,
  shoppingListQueryOptions,
} from "@/queries/shopping-list/options";
import { getQueryClient } from "@/lib/query-client";
import { ShoppingListItemUpdate } from "@/lib/schemas/shopping-list";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateShoppingListItemAction } from "@/queries/shopping-list/actions";
import { getActionErrorMessage } from "@/lib/error-messages";

const queryClient = getQueryClient();

export function useUpdateShoppingListItem(listId: string) {
  // Get query key from options object
  const queryKey = shoppingListQueryOptions(listId).queryKey;

  return useMutation({
    mutationFn: async ({
      itemId,
      data,
    }: {
      itemId: string;
      data: ShoppingListItemUpdate;
    }) => {
      const response = await updateShoppingListItemAction({
        listId,
        itemId,
        data,
      });

      // Throw an error if the action fails
      if (!response.success) {
        const errorMessage = getActionErrorMessage(response.errorCode, {
          NOT_FOUND: "Varan kunde inte hittas. Den kan ha tagits bort.",
        });
        throw new Error(errorMessage);
      }
    },

    onMutate: async (updatedItem) => {
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous state
      const prevShoppingList = queryClient.getQueryData(queryKey);

      // Update to the new state optimistically
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          items: old.items.map((item) =>
            item.id === updatedItem.itemId
              ? { ...item, ...updatedItem.data }
              : item,
          ),
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
