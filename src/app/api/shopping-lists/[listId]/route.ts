import { fetchShoppingList } from "@/data/shopping-list/queries";
import { verifyUser } from "@/data/user/verify-user";
import { safeQuery } from "@/lib/safe-query";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const paramsSchema = z.object({ listId: z.cuid2() });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ listId: string }> },
) {
  const user = await verifyUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Validate list ID
  const validated = paramsSchema.safeParse(await params);

  // Return 400 if validation fails
  if (!validated.success) {
    return NextResponse.json(
      { message: "Invalid shopping list ID path parameter" },
      { status: 400 },
    );
  }

  const { listId } = validated.data;

  // Fetch the shopping list
  const shoppingListRes = await safeQuery(() => fetchShoppingList(listId));

  // Return 500 if mutation fails
  if (!shoppingListRes.ok) {
    return NextResponse.json(
      { message: shoppingListRes.error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(shoppingListRes.data);
}
