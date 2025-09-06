import { createShoppingListItem } from "@/data/shopping-list-item/mutations";
import { fetchShoppingList } from "@/data/shopping-list/queries";
import { verifyUser } from "@/data/user/verify-user";
import { safeQuery } from "@/lib/safe-query";
import { shoppingListItemCreateSchema } from "@/lib/schemas/shopping-list";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ listId: string }> },
) {
  const user = await verifyUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Validate the list ID
  const validatedId = paramsSchema.safeParse(await params);

  // Return 400 if validation fails
  if (!validatedId.success) {
    return NextResponse.json(
      { message: "Invalid shopping list ID path parameter" },
      { status: 400 },
    );
  }

  const { listId } = validatedId.data;

  // Get request body
  let body: unknown;
  try {
    body = request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const validatedBody = shoppingListItemCreateSchema.safeParse(body);

  // Return 400 if validation fails
  if (!validatedBody.success) {
    return NextResponse.json(
      {
        message: "Invalid request JSON body",
        errors: z.flattenError(validatedBody.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  // Create the shopping list item
  const mutationResult = await createShoppingListItem({
    listId,
    data: validatedBody.data,
  });

  // Return 500 if mutation fails
  if (!mutationResult.ok) {
    return NextResponse.json(
      { message: mutationResult.error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "Shopping list item created successfully" },
    { status: 201 },
  );
}
