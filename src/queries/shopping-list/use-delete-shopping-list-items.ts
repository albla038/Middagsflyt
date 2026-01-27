import { getQueryClient } from "@/lib/query-client";
import { deleteShoppingListItemsAction } from "@/queries/shopping-list/actions";
import { shoppingListQueryOptions } from "@/queries/shopping-list/options";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useDeleteShoppingListItems(listId: string) {
  // Get query key from options object
  const queryKey = shoppingListQueryOptions(listId).queryKey;

  return useMutation({
    mutationFn: async (itemIds: string[]) => {
      const result = await deleteShoppingListItemsAction({ listId, itemIds });

      if (!result.success) {
        throw new Error(result.message, { cause: result.errors });
      }

      return result.message;
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

    onSuccess: (message) => {
      toast.success(message);
    },

    // If the mutation fails, roll back data
    onError: (err, updatedList, context) => {
      toast.error(err.message);
      queryClient.setQueryData(queryKey, context?.prevShoppingList);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
}
