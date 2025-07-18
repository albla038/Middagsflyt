"use server";

import { saveRecipe, unsaveRecipe } from "@/data/saved-recipe/mutations";
import { requireUser } from "@/data/user/verify-user";
import { Result } from "@/lib/types";
import { revalidatePath } from "next/cache";
import z from "zod/v4";

const recipeIdSchema = z.object({
  recipeId: z.cuid2(),
  slug: z.string(),
  isBookmarked: z.boolean(),
});

export async function toggleBookmark({
  recipeId,
  slug,
  isBookmarked,
}: {
  recipeId: string;
  slug: string;
  isBookmarked: boolean;
}): Promise<Result<{ isSaved: boolean }, Error>> {
  await requireUser();

  const validated = recipeIdSchema.safeParse({ recipeId, slug, isBookmarked });
  if (!validated.success) {
    console.log("Invalid recipe ID:", validated.error);
    return {
      ok: false,
      error: new Error("Invalid inputs to server action:", validated.error),
    };
  }

  const isSaved = validated.data.isBookmarked;

  if (isSaved) {
    const result = await unsaveRecipe(validated.data.recipeId);
    if (!result.ok) {
      return {
        ok: false,
        error: result.error,
      };
    }
  } else {
    const result = await saveRecipe(validated.data.recipeId);
    if (!result.ok) {
      return {
        ok: false,
        error: result.error,
      };
    }
  }

  revalidatePath(`/recipe/${validated.data.slug}`);

  return {
    ok: true,
    data: {
      isSaved: !isSaved,
    },
  };
}
