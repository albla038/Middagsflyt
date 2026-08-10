"use server";

import { saveRecipe, unsaveRecipe } from "@/data/saved-recipe/mutations";
import { requireUser } from "@/data/user/verify-user";
import { ActionResponseData } from "@/lib/types/api";
import { revalidatePath } from "next/cache";
import z from "zod";

const recipeIdSchema = z.object({
  recipeId: z.cuid2(),
  isBookmarked: z.boolean(),
  pathname: z.string(),
});

export async function toggleBookmarkAction(
  data: z.infer<typeof recipeIdSchema>,
): Promise<ActionResponseData<{ isSaved: boolean }>> {
  await requireUser();

  // Validate inputs
  const validated = recipeIdSchema.safeParse(data);

  // Return error code if validation fails
  if (!validated.success) {
    return { success: false, errorCode: "VALIDATION_FAILED" };
  }

  const isSaved = validated.data.isBookmarked;

  const mutationRes = isSaved
    ? await unsaveRecipe(validated.data.recipeId)
    : await saveRecipe(validated.data.recipeId);

  if (!mutationRes.ok) {
    return { success: false, errorCode: mutationRes.errorCode };
  }

  revalidatePath(validated.data.pathname);
  revalidatePath("/saved-recipes");
  revalidatePath("/library");
  revalidatePath("/schedule/recipe/[id]", "page");

  return { success: true, data: { isSaved: !isSaved } };
}
