import { fetchAllSavedRecipes } from "@/data/recipe/queries";
import { verifyUser } from "@/data/user/verify-user";
import { safeQuery } from "@/lib/safe-query";
import { ORDER_OPTIONS, SORT_BY_OPTIONS } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

const searchParamsSchema = z.object({
  query: z.string().catch(""),
  order: z.enum(ORDER_OPTIONS).optional(),
  sort: z.enum(SORT_BY_OPTIONS).optional(),
});

export async function GET(request: NextRequest) {
  const user = await verifyUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Validate search params
  const rawSearchParams = Object.fromEntries(request.nextUrl.searchParams);
  const validated = searchParamsSchema.safeParse(rawSearchParams);

  // Return 400 if validation fails
  if (!validated.success) {
    const errors = z.flattenError(validated.error).fieldErrors;

    return NextResponse.json(
      { message: "Invalid search parameters", errors },
      { status: 400 },
    );
  }

  // Fetch recipes based on search params
  const { query, order, sort } = validated.data;

  const recipesRes = await safeQuery(() =>
    fetchAllSavedRecipes(query, order, sort),
  );

  if (!recipesRes.ok) {
    return NextResponse.json(
      { message: recipesRes.error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(recipesRes.data);
}
