import { shoppingListQueryOptions } from "@/hooks/queries/shopping-list/queries";
import { getQueryClient } from "@/lib/query-client";
import { ShoppingListItemUpdate } from "@/lib/schemas/shopping-list";
import { updateShoppingListItem } from "@/lib/services/shopping-list-items/mutations";
import { useMutation } from "@tanstack/react-query";

export function useUpdateShoppingListItem(listId: string) {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: string;
      data: ShoppingListItemUpdate;
    }) => updateShoppingListItem({ listId, itemId, data }),

    onMutate: async (updatedItem) => {
      // Get query key from options object
      const queryKey = shoppingListQueryOptions(listId).queryKey;

      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous state
      const previousShoppingList = queryClient.getQueryData(queryKey);

      // Update to the new state
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
      return { previousShoppingList };
    },

    // If the mutation fails, roll back data
    onError: (err, updatedItem, context) => {
      // TODO Display error
      queryClient.setQueryData(
        shoppingListQueryOptions(listId).queryKey,
        context?.previousShoppingList,
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: shoppingListQueryOptions(listId).queryKey,
      });
    },
  });
}
