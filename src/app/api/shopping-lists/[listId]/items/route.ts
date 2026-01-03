import { createShoppingListItem } from "@/data/shopping-list-item/mutations";
import { verifyUser } from "@/data/user/verify-user";
import { shoppingListItemCreateSchema } from "@/lib/schemas/shopping-list";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const paramsSchema = z.object({ listId: z.cuid2() });

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
    body = await request.json();
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

  return NextResponse.json(mutationResult.data, { status: 201 });
}
