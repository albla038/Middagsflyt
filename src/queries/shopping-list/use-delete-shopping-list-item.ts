import { zodErrorResponseSchema } from "@/lib/schemas/response";
import { getQueryClient } from "@/lib/query-client";
import { shoppingListQueryOptions } from "@/queries/shopping-list/options";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

async function deleteShoppingListItem({
  listId,
  itemId,
}: {
  listId: string;
  itemId: string;
}) {
  let response: Response;
  try {
    response = await fetch(`/api/shopping-lists/${listId}/items/${itemId}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(
      "Ett nätverksfel inträffade när varan skulle tas bort. Vänligen försök igen.",
      {
        cause: error instanceof Error ? error : new Error(String(error)),
      },
    );
  }

  let resData: unknown;
  try {
    resData = response.json();
  } catch {
    throw new Error(
      "Kunde inte tolka svaret från servern. Vänligen försök igen.",
    );
  }

  if (!response.ok) {
    const validatedErrorRes = zodErrorResponseSchema.safeParse(resData);
    if (validatedErrorRes.success) {
      throw new Error(validatedErrorRes.data.message, {
        cause: validatedErrorRes.data.errors,
      });
    } else {
      throw new Error(`HTTP-fel ${response.status}: ${response.statusText}`);
    }
  }
}

const queryClient = getQueryClient();

export function useDeleteShoppingListItem(listId: string) {
  // Get query key from options object
  const queryKey = shoppingListQueryOptions(listId).queryKey;

  return useMutation({
    mutationFn: (itemId: string) =>
      deleteShoppingListItem({
        listId,
        itemId,
      }),

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
        queryKey,
      });
    },
  });
}
