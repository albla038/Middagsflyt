import robotsParser from "robots-parser";
import * as cheerio from "cheerio";
import { JsonLdRecipe, jsonLdRecipeSchema } from "@/lib/schemas/json-ld-recipe";
import { jsonrepair } from "jsonrepair";
import { parseHtmlRecipeWithLlm, parseJsonLdRecipeWithLlm } from "@/lib/llm";
import {
  GeneratedRecipe,
  recipeLlmResponseJsonSchema,
  recipeLlmResponseSchema,
} from "@/lib/schemas/recipe-generation";
import { PermissionResult, Result } from "@/lib/types";
import z from "zod";

// TODO Change userAgent in production
async function checkUrlPermission(
  targetUrlString: string,
  userAgent: string = "Middagsflyt/1.0 (+http://localhost:3000)",
): Promise<PermissionResult> {
  const url = new URL(targetUrlString);
  const robotsUrlString = `${url.origin}/robots.txt`;

  try {
    const response = await fetch(robotsUrlString);

    // If robots.txt is not found, assume permission is granted
    if (response.status === 404) {
      console.log(`robots.txt not found at ${robotsUrlString}`);
      return { allowed: true };
    }

    if (!response.ok) {
      return {
        allowed: false,
        reason: `Failed to fetch robots.txt from ${robotsUrlString} (status: ${response.status})`,
      };
    }

    const robotsTxt = await response.text();

    // Parse the robots.txt content
    const robots = robotsParser(robotsUrlString, robotsTxt);

    // Check if the URL is allowed
    const isAllowed = robots.isAllowed(targetUrlString, userAgent);

    // Return the result of the robots.txt check
    if (isAllowed === false)
      return {
        allowed: false,
        reason: `Scraping disallowed by robots.txt for user agent "${userAgent}"`,
      };

    // Else isAllowed is true or undefined
    // If undefined: no specific rule found, assume allowed as per common convention
    return { allowed: true };
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "An unknown error occurred";
    return {
      allowed: false,
      reason: `Error while processing robots.txt: ${reason}`,
    };
  }
}

function extractAndValidateJsonLdRecipes(
  $: cheerio.CheerioAPI,
): JsonLdRecipe | null {
  const $jsonLdScripts = $("script[type='application/ld+json']");

  // Early return if no scripts are found
  if ($jsonLdScripts.length === 0) return null;

  // Iterate over each JSON-LD script tag
  for (const $script of $jsonLdScripts) {
    const jsonLdContent = $($script).html();
    if (!jsonLdContent) continue; // Skip if no content

    // Parse the JSON-LD content
    let parsedData: unknown;
    try {
      // Repair JSON before parsing
      parsedData = JSON.parse(jsonrepair(jsonLdContent));
    } catch (error) {
      console.warn(
        "Failed to parse JSON-LD content:\n",
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
    // Return the first valid recipe found.
    for (const potentialRecipeData of potentialRecipeDataArray) {
      const validatedData = jsonLdRecipeSchema.safeParse(potentialRecipeData);
      if (validatedData.success) {
        return validatedData.data;
      } else {
        console.warn(
          "JSON-LD data failed schema validation:\n",
          z.prettifyError(validatedData.error),
        );
      }
    }
  }
  return null; // No valid JSON-LD recipes found
}

function sanitizeRecipeHtml($: cheerio.CheerioAPI): string {
  // Remove unnecessary tags
  $(
    "script, noscript, style, nav, header, footer, aside, form, iframe, img, picture, svg, video, audio",
  ).remove();
  $('link:not([rel="canonical"])').remove();

  // Filter for comments and remove
  $("*")
    .contents()
    .filter(function () {
      return this.type === "comment";
    })
    .remove();

  // Remove some presentational attributes
  $("*").removeAttr(
    "class, id, style, onclick, onmouseover, onmousedown, onkeydown",
  );

  const sanitizedHtmlString = $.html();

  // Remove whitespace
  let normalizedHtmlString = sanitizedHtmlString.replace(/[ \t]{2,}/g, " ");
  normalizedHtmlString = normalizedHtmlString.replace(/\n{3,}/g, "\n\n");
  return normalizedHtmlString.trim();
}

function processRecipeHtml(htmlString: string): JsonLdRecipe | string {
  // Load the HTML string into Cheerio
  const $ = cheerio.load(htmlString);

  // PLAN A: Search for structured JSON-LD data in script tags
  const jsonLdRecipe = extractAndValidateJsonLdRecipes($);
  if (jsonLdRecipe) return jsonLdRecipe;

  // PLAN B: Generic HTML sanitization
  console.log(
    "No JSON-LD recipes found, falling back to generic HTML parsing.",
  );
  return sanitizeRecipeHtml($);
}

async function getAndValidateRecipeFromLlm(
  data: JsonLdRecipe | string,
): Promise<Result<GeneratedRecipe, Error>> {
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
    console.error("LLM returned a non-JSON response:", response.data);
    return {
      ok: false,
      error: new Error("Failed to parse LLM response text into JSON", {
        cause: error,
      }),
    };
  }

  const validated = recipeLlmResponseSchema.safeParse(parsedResponse);

  if (validated.success) {
    const validatedData = validated.data;

    if (validatedData.status === "success") {
      // Return the recipe data if the status is success
      return { ok: true, data: validatedData.data };
    }

    return { ok: false, error: new Error(validatedData.error) };
  } else {
    return {
      ok: false,
      error: new Error("Parsed data failed schema validation", {
        cause: z.prettifyError(validated.error),
      }),
    };
  }
}

export async function scrapeRecipeData(
  url: string,
): Promise<Result<GeneratedRecipe, Error>> {
  const permissionResult = await checkUrlPermission(url);

  if (!permissionResult.allowed) {
    return { ok: false, error: new Error(permissionResult.reason) };
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return {
        ok: false,
        error: new Error(
          `Failed to fetch ${url}: HTTP Error ${response.status}`,
          { cause: response.statusText },
        ),
      };
    }

    const buffer = await response.arrayBuffer();
    let rawHtmlString: string;

    try {
      // Try decoding as UTF-8 first.
      rawHtmlString = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
    } catch {
      console.warn("UTF-8 decoding failed, falling back to ISO-8859-1.");
      rawHtmlString = new TextDecoder("iso-8859-1").decode(buffer);
    }

    const processedData = processRecipeHtml(rawHtmlString);

    return await getAndValidateRecipeFromLlm(processedData);
  } catch (error) {
    return {
      ok: false,
      error: new Error(`An unexpected error occurred while scraping ${url}`, {
        cause: error,
      }),
    };
  }
}
