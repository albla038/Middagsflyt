import { getActionErrorMessage } from "@/lib/error-messages";
import { getQueryClient } from "@/lib/query-client";
import {
  ShoppingListItemResponse,
  ShoppingListItemUpdate,
} from "@/lib/schemas/shopping-list";
import { updateShoppingListItemAction } from "@/queries/shopping-list/actions";
import {
  SHOPPING_LISTS_QUERY_KEY,
  shoppingListQueryOptions,
} from "@/queries/shopping-list/options";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useReorderShoppingListItem(listId: string) {
  const queryKey = shoppingListQueryOptions(listId).queryKey;

  return useMutation({
    mutationFn: async ({
      itemId,
      data,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      updatedList,
    }: {
      itemId: string;
      data: ShoppingListItemUpdate;
      updatedList: ShoppingListItemResponse[];
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
        queryKey: SHOPPING_LISTS_QUERY_KEY,
      });
    },
  });
}
