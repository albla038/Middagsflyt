"use server";

import { z } from "zod/v4";
import { scrapeRecipeData } from "@/lib/scraping";
import { createRecipeFromGeneratedData } from "@/data/recipe/mutations";
import { revalidatePath } from "next/cache";
import { checkIfRecipeExistsByUrl } from "@/data/recipe/queries";

export type FormState =
  | {
      status: "IDLE";
    }
  | {
      status: "SUCCESS";
      message: string;
    }
  | {
      status: "ERROR";
      message: string;
      errors?: {
        url?: string[];
        name?: string[];
      };
    };

const urlFormSchema = z.object({
  url: z.url({
    protocol: /^https?$/,
    hostname: z.regexes.domain,
    error:
      "Ange en giltig webbadress. Den ska börja med http:// eller https://.",
  }),
});

// TODO Add return type
export async function importRecipeFromUrl(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // TODO Add auth
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Validate the form data
  const validated = urlFormSchema.safeParse(Object.fromEntries(formData));

  if (!validated.success) {
    const errors = z.flattenError(validated.error).fieldErrors;

    console.log(errors);

    return {
      status: "ERROR",
      message: "Ogiltig inmatning, vänligen försök igen",
      errors,
    };
  }

  const url = validated.data.url;

  // Check if the URL is already imported
  if (await checkIfRecipeExistsByUrl(url)) {
    return {
      status: "SUCCESS",
      message: "Receptet finns redan i receptbiblioteket!",
    };
  }

  // Proceed with scraping the recipe data
  const scrapingRes = await scrapeRecipeData(url);

  if (!scrapingRes.ok) {
    console.error(scrapingRes.error);
    return {
      status: "ERROR",
      message:
        "Något gick fel när länken skulle läsas in, vänligen försök igen",
    };
  }

  // Store the recipe in the database
  const dbRes = await createRecipeFromGeneratedData(scrapingRes.data, url);

  if (!dbRes.ok) {
    console.error(dbRes.error);
    return {
      status: "ERROR",
      message:
        "Något gick fel när receptet skulle sparas, vänligen försök igen",
    };
  }

  revalidatePath("/");

  return { status: "SUCCESS", message: "Nytt recept importerades!" };
}
