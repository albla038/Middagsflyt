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

function sanitizeRecipeHtml($: cheerio.CheerioAPI): string {
  // Remove unnecessary tags
  $("script, noscript, style, img, picture, svg, nav, header, footer").remove();
  $('link:not([rel="canonical"])').remove();

  // Filter for comments and remove
  $("*")
    .contents()
    .filter(function () {
      return this.type === "comment";
    })
    .remove();

  console.log("Removed comments:", $.html().length);

  // Remove presentational attributes
  $("*").removeAttr("style, onclick, onmouseover");

  const sanitizedHtmlString = $.html();

  // Remove whitespace
  let normalizedHtmlString = sanitizedHtmlString.replace(/[ \t]{2,}/g, " ");
  normalizedHtmlString = normalizedHtmlString.replace(/\n{3,}/g, "\n\n");
  return normalizedHtmlString.trim();
}

// TODO remove export
export function processRecipeHtml(htmlString: string): JsonLdRecipe[] | string {
  // Load the HTML string into Cheerio
  const $ = cheerio.load(htmlString);

  // PLAN A: Search for structured JSON-LD data in script tags
  const jsonLdRecipes = extractAndValidateJsonLdRecipes($);
  if (jsonLdRecipes) return jsonLdRecipes;

  // PLAN B: Generic HTML sanitization
  return sanitizeRecipeHtml($);
}

async function getAndValidateRecipeFromLlm(
  data: JsonLdRecipe | string,
): Promise<Result<Recipe, Error>> {
  let response: Result<string, Error>;

  if (typeof data !== "string") {
    // PLAN A: Augment/enrich JSON-LD data with LLM
    response = await parseJsonLdRecipeWithLlm(
      data,
      recipeLlmResponseJsonSchema,
    );
  } else {
    // PLAN B: Generic HTML parsing with LLM
    response = await parseHtmlRecipeWithLlm(data, recipeLlmResponseJsonSchema);
  }

  if (!response.ok) return response;

  let parsedResponse: unknown;

  // Parse the response text
  try {
    parsedResponse = JSON.parse(response.data);
  } catch (error) {
    return {
      ok: false,
      error: new Error("Failed to parse LLM response text into JSON", {
        cause: error,
      }),
    };
  }

  const validatedResponse = recipeLlmResponseSchema.safeParse(parsedResponse);

  if (validatedResponse.success) {
    const validatedData = validatedResponse.data;

    if (validatedData.status === "success") {
      // Return the recipe data if the status is success
      return { ok: true, data: validatedData.data };
    }

    return {ok: false, error: new Error(validatedData.error)};

  } else {
    return {
      ok: false,
      error: new Error("Parsed data failed schema validation", {
        cause: z.prettifyError(validatedResponse.error),
      }),
    };
  }
}
