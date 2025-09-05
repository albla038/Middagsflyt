import { updateShoppingListItem } from "@/data/shopping-list-item/mutations";
import { verifyUser } from "@/data/user/verify-user";
import { shoppingListItemUpdateSchema } from "@/lib/schemas/shopping-list";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

const paramsSchema = z.object({
  listId: z.cuid2(),
  itemId: z.cuid2(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ listId: string; itemId: string }> },
) {
  const user = await verifyUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Validate list ID
  const validatedParams = paramsSchema.safeParse(await params);

  // Return 400 if validation fails
  if (!validatedParams.success) {
    const errors = z.flattenError(validatedParams.error).fieldErrors;

    return NextResponse.json(
      { message: "Invalid ID:s", errors },
      { status: 400 },
    );
  }

  const { listId, itemId } = validatedParams.data;

  // Get request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const validatedBody = shoppingListItemUpdateSchema.safeParse(body);

  // Return 400 if validation fails
  if (!validatedBody.success) {
    return NextResponse.json(
      {
        message: "Invalid request body",
        errors: z.flattenError(validatedBody.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const mutationResult = await updateShoppingListItem({
    listId,
    itemId,
    data: validatedBody.data,
  });

  if (!mutationResult.ok) {
    return NextResponse.json(
      { message: mutationResult.error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "Shopping list item updated successfully" },
    { status: 200 },
  );
}
