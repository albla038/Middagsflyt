import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";

export async function checkIfRecipeIsSaved(recipeId: string): Promise<boolean> {
  const user = await requireUser();

  try {
    const saved = await prisma.savedRecipe.findUnique({
      where: {
        userId_recipeId: { recipeId, userId: user.id },
      },
    });

    return !!saved;
  } catch (error) {
    throw new Error("Något gick fel, vänligen försök igen!", {
      cause: error instanceof Error ? error : new Error(String(error)),
    });
  }
}
