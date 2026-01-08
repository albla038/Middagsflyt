import { zodErrorResponseSchema } from "@/lib/schemas/response";
import {
  ShoppingListItemCreate,
  ShoppingListItemUpdate,
} from "@/lib/schemas/shopping-list";

export async function createShoppingListItem({
  listId,
  data,
}: {
  listId: string;
  data: ShoppingListItemCreate;
}) {
  let response: Response;
  try {
    response = await fetch(
      `/api/shopping-lists/${listId}/items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
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
      `/api/shopping-lists/${listId}/items/${itemId}`,
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

export async function deleteShoppingListItem({
  listId,
  itemId,
}: {
  listId: string;
  itemId: string;
}) {
  let response: Response;
  try {
    response = await fetch(
      `/api/shopping-lists/${listId}/items/${itemId}`,
      {
        method: "DELETE",
      },
    );
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
