import robotsParser from "robots-parser";
import * as cheerio from "cheerio";
import { JsonLdRecipe, jsonLdRecipeSchema } from "@/lib/schemas/json-ld-recipe";
import { jsonrepair } from "jsonrepair";

// TODO Change userAgent in production
async function checkUrlPermission(
  targetUrlStr: string,
  userAgent: string = "Middagsflyt/1.0 (+http://localhost:3000)",
) {
  const url = new URL(targetUrlStr);
  const robotsUrlStr = `${url.origin}/robots.txt`;

  try {
    const response = await fetch(robotsUrlStr);

    // If robots.txt is not found, assume permission is granted
    if (response.status === 404) {
      console.log(`robots.txt not found at ${robotsUrlStr}`);
      return true;
    }

    if (!response.ok) {
      console.error(`Failed to fetch robots.txt from ${robotsUrlStr}`);
      return null;
    }

    const robotsTxt = await response.text();

    // Parse the robots.txt content
    const robots = robotsParser(robotsUrlStr, robotsTxt);

    // Check if the URL is allowed
    const isAllowed = robots.isAllowed(targetUrlStr, userAgent);

    // No specific rule found, assume allowed as per common convention
    if (isAllowed === undefined) {
      console.log(
        `No specific robots.txt rule for ${targetUrlStr}, assuming allowed.`,
      );
      return true;
    }

    // Return the result of the robots.txt check
    if (isAllowed) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Unknown error while fetching robots.txt:", error);
    return null;
  }
}

// TODO Consider returning [] instead of null
function extractAndValidateJsonLdRecipes(
  $: cheerio.CheerioAPI,
): JsonLdRecipe[] | null {
  const jsonLdScripts = $("script[type='application/ld+json']");
  const recipes: JsonLdRecipe[] = [];

  // Early return if no scripts are found
  if (jsonLdScripts.length === 0) return null;

  for (const script of jsonLdScripts) {
    const jsonLdContent = $(script).html();
    if (!jsonLdContent) continue;

    // Parse to JSON
    let parsedData: unknown;
    try {
      // Repair JSON before parsing
      parsedData = JSON.parse(jsonrepair(jsonLdContent));
    } catch (error) {
      console.warn(
        "Failed to parse JSON-LD content:",
        error,
        "\nContent:",
        jsonLdContent,
      );
      continue;
    }

    // Normalize to array
    const parsedDataArray = Array.isArray(parsedData)
      ? parsedData
      : [parsedData];

    // Pre-filter for objects that claim to be a Recipe
    const potentialRecipeDataArray = parsedDataArray.filter(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "@type" in item &&
        item["@type"] === "Recipe",
    );

    // Validate each JSON-LD object against schema.
    // Add only successfull validations (i.e. Recipe objects)
    for (const potentialRecipeData of potentialRecipeDataArray) {
      const validatedData = jsonLdRecipeSchema.safeParse(potentialRecipeData);
      if (validatedData.success) {
        recipes.push(validatedData.data);
      } else {
        console.warn(
          "JSON-LD data failed schema validation:",
          validatedData.error.issues,
        );
      }
    }
  }

  if (recipes.length === 0) return null;
  return recipes;
}
