import { fetchAllShoppingLists } from "@/data/shopping-list/queries";
import { verifyUser } from "@/data/user/verify-user";
import { errorCodeToHttpStatus } from "@/lib/error-code-http-mapper";
import { safeQuery } from "@/lib/safe-query";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await verifyUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized " }, { status: 401 });
  }

  // Fecth all shopping lists
  const queryRes = await safeQuery(() => fetchAllShoppingLists());

  // Return HTTP error if query fails
  if (!queryRes.ok) {
    return NextResponse.json(
      { error: queryRes.errorCode },
      { status: errorCodeToHttpStatus(queryRes.errorCode) },
    );
  }

  return NextResponse.json(queryRes.data);
}
