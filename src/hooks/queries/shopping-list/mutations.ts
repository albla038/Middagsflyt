import { shoppingListQueryOptions } from "@/hooks/queries/shopping-list/options";
import { getQueryClient } from "@/lib/query-client";
import {
  ShoppingListItemCreate,
  ShoppingListItemUpdate,
} from "@/lib/schemas/shopping-list";
import {
  createShoppingListItem,
  updateShoppingListItem,
} from "@/lib/services/shopping-list-items/mutations";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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

export function useUpdateShoppingListItem(listId: string) {
  // Get query key from options object
  const queryKey = shoppingListQueryOptions(listId).queryKey;

  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: string;
      data: ShoppingListItemUpdate;
    }) => updateShoppingListItem({ listId, itemId, data }),

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
        queryKey,
      });
    },
  });
}
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
    },
  });
}
