import { JsonLdRecipe } from "@/lib/schemas/json-ld-recipe";
import { Result } from "@/lib/types";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod/v4";

const llm = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const LLM_MODEL = "gemini-2.5-flash";

// TODO Improve by adding explicit roles

export async function parseJsonLdRecipeWithLlm(
  jsonLdRecipes: JsonLdRecipe,
  jsonSchema: z.core.JSONSchema.JSONSchema,
): Promise<Result<string, Error>> {
  const context = `You are an expert recipe data extractor. Your task is to process the provided JSON-LD data and transform it into a structured JSON object that adheres to the given response schema.

Follow these instructions carefully:
- Map the extracted information to the fields defined in the response schema.
- Do not invent data. If a value for an optional field is not found, omit its key from the object.
- For ingredient quantities, prefer measured units (e.g., "200 g", "1 dl") over simple counts (e.g., "1 onion") when possible.
`;

  try {
    const response = await llm.models.generateContent({
      model: LLM_MODEL,
      contents: JSON.stringify(jsonLdRecipes),
      config: {
        systemInstruction: context,
        responseMimeType: "application/json",
        responseSchema: jsonSchema,
      },
    });

    console.log("Token count:", response?.usageMetadata?.totalTokenCount);

    if (response.text) return { ok: true, data: response.text };

    return { ok: false, error: new Error("No response text from LLM") };
  } catch (error) {
    return {
      ok: false,
      error: new Error("LLM error", { cause: error }),
    };
  }
}

export async function parseHtmlRecipeWithLlm(
  htmlString: string,
  jsonSchema: z.core.JSONSchema.JSONSchema,
): Promise<Result<string, Error>> {
  const context = `You are an expert recipe data extractor. Your task is to analyze the provided sanitized HTML of a recipe webpage and extract the recipe information into a structured JSON object that adheres to the given response schema.

Follow these instructions carefully:
- Focus only on the main recipe content. Ignore all surrounding content like navigation menus, user comments, ads, and footers.
- If the page contains multiple recipes, extract only the primary one.
- Map the extracted information to the fields defined in the response schema.
- Do not invent data. If a value for an optional field is not found, omit its key from the object.
- For ingredient quantities, prefer measured units (e.g., "200 g", "1 dl") over simple counts (e.g., "1 onion") when possible.
`;

  try {
    const response = await llm.models.generateContent({
      model: LLM_MODEL,
      contents: htmlString,
      config: {
        systemInstruction: context,
        responseMimeType: "application/json",
        responseSchema: jsonSchema,
      },
    });

    console.log("Token count:", response?.usageMetadata?.totalTokenCount);

    if (response.text) return { ok: true, data: response.text };

    return { ok: false, error: new Error("No response text from LLM") };
  } catch (error) {
    return {
      ok: false,
      error: new Error("LLM error", { cause: error }),
    };
  }
}
