import { getQueryClient } from "@/lib/query-client";
import { ShoppingListItemCreate } from "@/lib/schemas/shopping-list";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { shoppingListQueryOptions } from "./options";
import { createShoppingListItem } from "@/queries/shopping-list/api";

const queryClient = getQueryClient();

export function useCreateShoppingListItem(listId: string) {
  // Get query key from options object
  const queryKey = shoppingListQueryOptions(listId).queryKey;

  return useMutation({
    mutationFn: (newItem: ShoppingListItemCreate) =>
      createShoppingListItem({
        listId,
        data: newItem,
      }),

    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous state
      const prevShoppingList = queryClient.getQueryData(queryKey);

      // Calculate displayOrder for the new item
      let newDisplayOrder = 1000;
      if (prevShoppingList && prevShoppingList.items.length > 0) {
        // Find the highest existing order value in the cache
        const maxOrder = Math.max(
          ...prevShoppingList.items.map((i) => i.displayOrder),
        );
        newDisplayOrder = maxOrder + 1000;
      }

      // Add to the new state optimistically
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;

        const now = new Date();

        return {
          ...old,
          items: [
            {
              ...newItem,
              isPurchased: false,
              isManuallyEdited: true,
              createdAt: now,
              updatedAt: now,
              displayOrder: newDisplayOrder,
            },
            ...old.items,
          ],
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
        queryKey,
      });
    },
  });
}
