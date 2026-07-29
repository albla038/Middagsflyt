import { responseSchema } from "@/lib/schemas/response";
import {
  ShoppingListResponse,
  shoppingListResponseSchema,
} from "@/lib/schemas/shopping-list";

export async function fetchShoppingList(
  listId: string,
): Promise<ShoppingListResponse> {
  // Fetch the data
  let response: Response;
  try {
    response = await fetch(`/api/shopping-lists/${listId}`);
  } catch (error) {
    throw new Error(
      "Ett nätverksfel inträffade när inköpslistan skulle hämtas. Vänligen försök igen.",
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

  // Throw error if response is not ok
  if (!response.ok) {
    const validatedErrorRes = responseSchema.safeParse(resData);
    if (validatedErrorRes.success) {
      throw new Error(validatedErrorRes.data.message);
    } else {
      throw new Error(`HTTP-fel ${response.status}: ${response.statusText}`);
    }
  }
  // Validate the data
  const validated = shoppingListResponseSchema.safeParse(resData);

  // Throw error if validation fails
  if (!validated.success) {
    throw new Error(
      `Något gick fel när inköpslistan skulle hämtas. Vänligen försök igen!`,
      {
        cause: validated.error,
      },
    );
  }

  return validated.data;
}
