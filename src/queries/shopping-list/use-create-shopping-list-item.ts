import { getQueryClient } from "@/lib/query-client";
import { ShoppingListItemCreate } from "@/lib/schemas/shopping-list";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { zodErrorResponseSchema } from "@/lib/schemas/response";
import { shoppingListQueryOptions } from "./options";

async function createShoppingListItem({
  listId,
  data,
}: {
  listId: string;
  data: ShoppingListItemCreate;
}) {
  let response: Response;
  try {
    response = await fetch(`/api/shopping-lists/${listId}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    throw new Error(
      "Ett nätverksfel inträffade när varan skulle skapas. Vänligen försök igen.",
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
