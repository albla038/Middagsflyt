import { fetchShoppingList } from "@/data/shopping-list/queries";
import { verifyUser } from "@/data/user/verify-user";
import { safeQuery } from "@/lib/safe-query";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

const idSchema = z.cuid2();

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  const user = await verifyUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Validate list ID
  const { id } = await params;
  const validated = idSchema.safeParse(id);

  // Return 400 if validation fails
  if (!validated.success) {
    return NextResponse.json(
      { message: "Invalid shopping list ID" },
      { status: 400 },
    );
  }

  const listId = validated.data;

  const shoppingListRes = await safeQuery(() => fetchShoppingList(listId));

  if (!shoppingListRes.ok) {
    return NextResponse.json(
      { message: shoppingListRes.error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(shoppingListRes.data);
}
