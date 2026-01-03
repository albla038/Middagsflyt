import {
  deleteShoppingListItem,
  updateShoppingListItem,
} from "@/data/shopping-list-item/mutations";
import { verifyUser } from "@/data/user/verify-user";
import { shoppingListItemUpdateSchema } from "@/lib/schemas/shopping-list";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

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

  // Validate list and item ID
  const validatedParams = paramsSchema.safeParse(await params);

  // Return 400 if validation fails
  if (!validatedParams.success) {
    const errors = z.flattenError(validatedParams.error).fieldErrors;

    return NextResponse.json(
      { message: "Invalid ID:s in query parameters", errors },
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

  return NextResponse.json(mutationResult.data, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ listId: string; itemId: string }> },
) {
  const user = await verifyUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Validate list and item ID
  const validated = paramsSchema.safeParse(await params);

  // Return 400 if validation fails
  if (!validated.success) {
    const errors = z.flattenError(validated.error).fieldErrors;

    return NextResponse.json(
      { message: "Invalid ID:s in query parameters", errors },
      { status: 400 },
    );
  }

  const { listId, itemId } = validated.data;

  const deleteResult = await deleteShoppingListItem({ listId, itemId });

  // Return 500 if deletion fails
  if (!deleteResult.ok) {
    return NextResponse.json(
      { message: deleteResult.error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(deleteResult.data, { status: 200 });
}
