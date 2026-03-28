import { fetchAllShoppingLists } from "@/data/shopping-list/queries";
import { verifyUser } from "@/data/user/verify-user";
import { safeQuery } from "@/lib/safe-query";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await verifyUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized " }, { status: 401 });
  }

  // Fecth all shopping lists
  const shoppingListsRes = await safeQuery(() => fetchAllShoppingLists());

  // Return 500 if DB operation fails
  if (!shoppingListsRes.ok) {
    return NextResponse.json(
      { message: shoppingListsRes.error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(shoppingListsRes.data);
}
