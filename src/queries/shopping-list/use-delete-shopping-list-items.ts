import { getActionErrorMessage } from "@/lib/error-messages";
import { getQueryClient } from "@/lib/query-client";
import { deleteShoppingListItemsAction } from "@/queries/shopping-list/actions";
import {
  SHOPPING_LISTS_QUERY_KEY,
  shoppingListQueryOptions,
} from "@/queries/shopping-list/options";
import { useRestoreShoppingListItems } from "@/queries/shopping-list/use-restore-shopping-list-items";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useDeleteShoppingListItems(listId: string) {
  // Get query key from options object
  const queryKey = shoppingListQueryOptions(listId).queryKey;

  const { mutate: restoreItems } = useRestoreShoppingListItems(listId);

  return useMutation({
    mutationFn: async (itemIds: string[]) => {
      const response = await deleteShoppingListItemsAction({ listId, itemIds });

      // Throw an error if the action fails
      if (!response.success) {
        const errorMessage = getActionErrorMessage(response.errorCode, {
          NOT_FOUND:
            "Varorna du försökte ta bort kunde inte hittas. De kan redan ha tagits bort",
        });
        throw new Error(errorMessage);
      }
    },

    onMutate: async (itemIds) => {
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous state
      const prevShoppingList = queryClient.getQueryData(queryKey);

      // Update to the new state optimistically
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          items: old.items.filter((item) => !itemIds.includes(item.id)),
        };
      });

      // Return a context object with the snapshotted state
      return { prevShoppingList };
    },

    onSuccess: (_, itemIds, context) => {
      toast("Varorna togs bort.", {
        // Restore deleted items on cancel
        cancel: {
          label: "Ångra",
          onClick: () => {
            const prevShoppingList = context?.prevShoppingList;

            // Return if no previous shopping list is available
            if (!prevShoppingList) return;

            // Filter deleted items from previous list state
            const deletedItems = prevShoppingList.items.filter((item) =>
              itemIds.includes(item.id),
            );

            if (deletedItems.length > 0) {
              restoreItems(deletedItems);
            }
          },
        },
      });
    },

    // If the mutation fails, roll back data
    onError: (err, _, context) => {
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
