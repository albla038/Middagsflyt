import { fetchRecipeIngredientsForShoppingList } from "@/data/recipe-ingredient/queries";
import { verifyUser } from "@/data/user/verify-user";
import { safeQuery } from "@/lib/safe-query";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const searchParamsSchema = z
  .object({
    // Comma-separated list of scheduled recipe IDs
    scheduledRecipeIds: z
      .string()
      .transform((val) => val.split(","))
      .optional(),
    // Comma-separated list of recipe IDs
    recipeIds: z
      .string()
      .transform((val) => val.split(","))
      .optional(),
  })
  .refine((data) => data.recipeIds || data.scheduledRecipeIds, {
    error: "Either recipeIds or scheduledRecipeIds must be provided (or both).",
  });

export async function GET(request: NextRequest) {
  const user = await verifyUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Validate search parameters
  const rawSearchParams = Object.fromEntries(request.nextUrl.searchParams);
  const validated = searchParamsSchema.safeParse(rawSearchParams);

  // Return 400 if validation fails
  if (!validated.success) {
    return NextResponse.json(
      {
        message: "Invalid search parameters",
        error: z.flattenError(validated.error),
      },
      { status: 400 },
    );
  }

  const { recipeIds, scheduledRecipeIds } = validated.data;

  const recipeIngredientsRes = await safeQuery(() =>
    fetchRecipeIngredientsForShoppingList(recipeIds, scheduledRecipeIds),
  );

  // Return 500 if DB query fails
  if (!recipeIngredientsRes.ok) {
    return NextResponse.json(
      { message: recipeIngredientsRes.error },
      { status: 500 },
    );
  }

  return NextResponse.json(recipeIngredientsRes.data);
}
