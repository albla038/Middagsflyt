import { deleteShoppingListItem } from "@/data/shopping-list-item/mutations";
import { verifyUser } from "@/data/user/verify-user";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const paramsSchema = z.object({
  listId: z.cuid2(),
  itemId: z.cuid2(),
});

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
