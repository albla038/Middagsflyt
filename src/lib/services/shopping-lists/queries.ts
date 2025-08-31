import { API_BASE_URL } from "@/lib/constants";
import { ErrorResponseSchema } from "@/lib/schemas/response";
import {
  ShoppingListResponse,
  shoppingListResponseSchema,
} from "@/lib/schemas/shopping-list";

export async function fetchShoppingList(
  listId: string,
): Promise<ShoppingListResponse> {
  // Fetch the data
  const response = await fetch(`${API_BASE_URL}/api/shopping-lists/${listId}`);
  const data = await response.json();

  // Throw error if response is not ok
  if (!response.ok) {
    const error = ErrorResponseSchema.safeParse(data);
    if (error.success) {
      throw new Error(error.data.message);
    } else {
      throw new Error(`HTTP error ${response.status} ${response.statusText}`);
    }
  }

  // Validate the data
  const validated = shoppingListResponseSchema.safeParse(data);

  // Throw error if validation fails
  if (!validated.success) {
    throw new Error(
      `Något gick fel när sparade recept skulle hämtas. Vänlig försök igen!`,
    );
  }

  return validated.data;
}
