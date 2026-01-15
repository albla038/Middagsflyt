import { shoppingListQueryOptions } from "@/queries/shopping-list/options";
import { getQueryClient } from "@/lib/query-client";
import { ShoppingListItemUpdate } from "@/lib/schemas/shopping-list";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { zodErrorResponseSchema } from "@/lib/schemas/response";

async function updateShoppingListItem({
  listId,
  itemId,
  data,
}: {
  listId: string;
  itemId: string;
  data: ShoppingListItemUpdate;
}) {
  let response: Response;
  try {
    response = await fetch(`/api/shopping-lists/${listId}/items/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    throw new Error(
      "Ett nätverksfel inträffade när varan skulle uppdateras. Vänligen försök igen.",
      {
        cause: error instanceof Error ? error : new Error(String(error)),
      },
    );
  }

  let resData: unknown;
  try {
    resData = await response.json();
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
