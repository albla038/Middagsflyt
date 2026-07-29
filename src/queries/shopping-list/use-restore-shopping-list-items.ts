import { getActionErrorMessage } from "@/lib/error-messages";
import { getQueryClient } from "@/lib/query-client";
import { ShoppingListItemsRestore } from "@/lib/schemas/shopping-list";
import { restoreShoppingListItemsAction } from "@/queries/shopping-list/actions";
import {
  SHOPPING_LISTS_QUERY_KEY,
  shoppingListQueryOptions,
} from "@/queries/shopping-list/options";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useRestoreShoppingListItems(listId: string) {
  // Get query key from options object
  const queryKey = shoppingListQueryOptions(listId).queryKey;

  return useMutation({
    mutationFn: async (deletedItems: ShoppingListItemsRestore) => {
      const response = await restoreShoppingListItemsAction({
        listId,
        data: deletedItems,
      });

      if (!response.success) {
        const errorMessage = getActionErrorMessage(response.errorCode, {
          NOT_FOUND:
            "Varorna kunde inte återställas. Inköpslistan kan ha tagits bort.",
        });
        throw new Error(errorMessage);
      }
    },

    onMutate: async (deletedItems) => {
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous state
      const prevShoppingList = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;

        const restoredItems = [...old.items, ...deletedItems];

        return {
          ...old,
          items: restoredItems.sort((a, b) => b.displayOrder - a.displayOrder),
        };
      });

      return { prevShoppingList };
    },

    onSuccess: () => {
      toast.success("Varorna återställdes.");
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
