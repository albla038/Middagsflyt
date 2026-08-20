"use server";

import { createRecipeFromGeneratedData } from "@/data/recipe/mutations";
import { findRecipeSlugByUrl } from "@/data/recipe/queries";
import { requireUser } from "@/data/user/verify-user";
import { legacySafeQuery } from "@/lib/safe-query";
import { scrapeRecipeData } from "@/lib/scraping";
import { ActionState } from "@/lib/types";
import { revalidatePath } from "next/cache";
import z from "zod";

type FormState = ActionState<
  string,
  {
    url?: string[];
    name?: string[];
  }
>;

const urlFormSchema = z.object({
  url: z.url({
    protocol: /^https?$/,
    hostname: z.regexes.domain,
    error:
      "Ange en giltig webbadress. Den ska börja med http:// eller https://.",
  }),
});

export async function importRecipeFromUrl(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUser();

  // Validate the form data
  const validated = urlFormSchema.safeParse(Object.fromEntries(formData));

  if (!validated.success) {
    const errors = z.flattenError(validated.error).fieldErrors;

    return {
      success: false,
      message: "Ogiltig inmatning. Vänligen försök igen",
      errors,
    };
  }

  const url = validated.data.url;

  // Check if the URL is already imported
  const recipeExistsRes = await legacySafeQuery(() => findRecipeSlugByUrl(url));
  if (!recipeExistsRes.ok) {
    return {
      success: false,
      message: "Internt serverfel, vänligen försök igen",
    };
  }
  if (recipeExistsRes.data) {
    return {
      success: true,
      message: "Receptet finns redan i receptbiblioteket!",
      data: recipeExistsRes.data,
    };
  }

  // Proceed with scraping the recipe data
  const scrapingRes = await scrapeRecipeData(url);

  if (!scrapingRes.ok) {
    console.error(scrapingRes.error);
    return {
      success: false,
      message:
        "Något gick fel när länken skulle läsas in, vänligen försök igen",
    };
  }

  // Store the recipe in the database
  const mutationRes = await createRecipeFromGeneratedData(
    scrapingRes.data,
    url,
  );

  if (!mutationRes.ok) {
    return {
      success: false,
      message:
        "Något gick fel när receptet skulle sparas, vänligen försök igen",
    };
  }

  revalidatePath("/", "layout");

  return { success: true, message: "Nytt recept importerades!" };
}
