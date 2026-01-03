import { GoogleGenAI } from "@google/genai";
import z from "zod";
import { Result } from "@/lib/types";
import { JsonLdRecipe } from "@/lib/schemas/json-ld-recipe";
import { parse, toSeconds } from "iso8601-duration";

const llm = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const LLM_MODEL = "gemini-2.5-flash";

async function callLlmWithSchema({
  taskDescription,
  data,
  context,
  jsonSchema,
}: {
  taskDescription: string;
  data: string;
  context: string;
  jsonSchema: z.core.JSONSchema.JSONSchema;
}): Promise<Result<string, Error>> {
  try {
    const startTime = Date.now();
    const response = await llm.models.generateContent({
      model: LLM_MODEL,
      contents: {
        role: "user",
        parts: [{ text: taskDescription }, { text: data }],
      },
      config: {
        systemInstruction: { role: "system", parts: [{ text: context }] },
        responseMimeType: "application/json",
        responseSchema: jsonSchema,
      },
    });

    const responseTime = Date.now() - startTime;

    console.log("Token count:", response?.usageMetadata?.totalTokenCount);
    console.log("Response time:", responseTime / 1000, "seconds");

    if (response.text) return { ok: true, data: response.text };

    return { ok: false, error: new Error("No response text from LLM") };
  } catch (error) {
    return {
      ok: false,
      error: new Error("LLM error", { cause: error }),
    };
  }
}

export async function parseJsonLdRecipeWithLlm(
  jsonLdRecipe: JsonLdRecipe,
  jsonSchema: z.core.JSONSchema.JSONSchema,
): Promise<Result<string, Error>> {
  // Convert ISO 8601 durations to seconds
  jsonLdRecipe.totalTime = jsonLdRecipe.totalTime
    ? String(toSeconds(parse(jsonLdRecipe.totalTime)))
    : undefined;

  const jsonLdTaskDescription =
    "Analyze the following JSON-LD data and extract the recipe data based on my system instructions.";

  const context = `You are an expert recipe data extractor. Your task is to process the provided JSON-LD data and transform it into a structured JSON object that adheres to the given response schema.

Follow these instructions carefully:
- Map the extracted information to the fields defined in the response schema.
- Do not invent data. If a value for an optional field is not found, omit its key from the object.
- For ingredient quantities, prefer measured units (e.g., "200 g", "1 dl") over simple counts (e.g., "1 onion") when suitable.
`; // TODO Allow LLM to generate fields if they are missing, but not invent data

  return await callLlmWithSchema({
    taskDescription: jsonLdTaskDescription,
    data: JSON.stringify(jsonLdRecipe),
    context,
    jsonSchema,
  });
}

export async function parseHtmlRecipeWithLlm(
  htmlString: string,
  jsonSchema: z.core.JSONSchema.JSONSchema,
): Promise<Result<string, Error>> {
  const htmlTaskDescription =
    "Analyze the following sanitized HTML and extract the recipe data based on my system instructions.";

  const context = `You are an expert recipe data extractor. Your task is to analyze the provided sanitized HTML of a recipe webpage and extract the recipe information into a structured JSON object that adheres to the given response schema.

Follow these instructions carefully:
- Focus only on the main recipe content. Ignore all surrounding content like navigation menus, user comments, ads, and footers.
- If the page contains multiple recipes, extract only the primary one.
- Map the extracted information to the fields defined in the response schema.
- Do not invent data. If a value for an optional field is not found, omit its key from the object.
- For ingredient quantities, prefer measured units (e.g., "200 g", "1 dl") over simple counts (e.g., "1 onion") when possible.
`; // TODO Allow LLM to generate fields if they are missing, but not invent data

  return await callLlmWithSchema({
    taskDescription: htmlTaskDescription,
    data: htmlString,
    context,
    jsonSchema,
  });
}

export async function generateIngredientsWithLlm(
  ingredients: string[],
  jsonSchema: z.core.JSONSchema.JSONSchema,
): Promise<Result<string, Error>> {
  const taskDescription =
    "Use the following array to generate ingredient data based on my system instructions.";

  const context =
    "You are a Swedish culinary data expert. Generate ingredient data for the provided ingredient names that adheres to the given response schema.";

  return await callLlmWithSchema({
    taskDescription,
    data: JSON.stringify(ingredients),
    context,
    jsonSchema,
  });
}
