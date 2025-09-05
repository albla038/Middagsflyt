import { API_BASE_URL } from "@/lib/constants";
import { zodErrorResponseSchema } from "@/lib/schemas/response";
import { ShoppingListItemUpdate } from "@/lib/schemas/shopping-list";

export async function updateShoppingListItem({
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
    response = await fetch(
      `${API_BASE_URL}/api/shopping-lists/${listId}/items/${itemId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
  } catch (error) {
    throw new Error(
      "Ett nätverksfel inträffade vid uppdatering av varan. Vänligen försök igen.",
      {
        cause: error instanceof Error ? error : new Error(String(error)),
      },
    );
  }

  let resData: unknown;
  try {
    resData = await response.json();
  } catch {
    throw new Error(`HTTP-fel ${response.status}: ${response.statusText}`);
  }

  if (!response.ok) {
    const error = zodErrorResponseSchema.safeParse(resData);
    if (error.success) {
      throw new Error(error.data.message, {
        cause: error.data.errors,
      });
    } else {
      throw new Error(`HTTP-fel ${response.status}: ${response.statusText}`);
    }
  }
}
