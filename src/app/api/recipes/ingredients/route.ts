import { fetchRecipeIngredientsForShoppingList } from "@/data/recipe-ingredient/queries";
import { verifyUser } from "@/data/user/verify-user";
import { errorCodeToHttpStatus } from "@/lib/error-code-http-mapper";
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

  const queryRes = await safeQuery(() =>
    fetchRecipeIngredientsForShoppingList(recipeIds, scheduledRecipeIds),
  );

  // Return HTML error code if DB query fails
  if (!queryRes.ok) {
    return NextResponse.json(
      { error: queryRes.errorCode },
      { status: errorCodeToHttpStatus(queryRes.errorCode) },
    );
  }

  return NextResponse.json(queryRes.data);
}
