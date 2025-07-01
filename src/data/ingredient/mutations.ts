import "server-only";

import { Result } from "@/lib/types";
import {
  generatedIngredientsJsonSchema,
  generatedIngredientsSchema,
} from "@/lib/schemas/ingredient-generation";
import { generateIngredientsWithLlm } from "@/lib/llm";
import { z } from "zod/v4";
import prisma from "@/lib/prisma";
import { Ingredient } from "@/generated/prisma";

export async function generateAndCreateIngredients(
  ingredients: string[],
): Promise<Result<Ingredient[], Error>> {
  const response = await generateIngredientsWithLlm(
    ingredients,
    generatedIngredientsJsonSchema,
  );

  // Return early if the LLM call failed
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

  // Validate response
  const validated = generatedIngredientsSchema.safeParse(parsedResponse);

  if (!validated.success) {
    return {
      ok: false,
      error: new Error("Parsed data failed schema validation", {
        cause: z.prettifyError(validated.error),
      }),
    };
  }

  // Store the recipe in the database
  try {
    const createdIngredients = await prisma.$transaction(async (tx) => {
      const createPromises = validated.data.map((record) => {
        const {
          name,
          shoppingUnit,
          displayNameSingular,
          displayNamePlural,
          ingredientCategory,
          aliases,
        } = record;

        return tx.ingredient.create({
          data: {
            name,
            shoppingUnit,
            displayNameSingular,
            displayNamePlural,
            ingredientCategory: {
              connect: { name: ingredientCategory.name },
            },
            ingredientAliases: {
              create: aliases?.map((alias) => ({
                name: alias,
              })),
            },
          },
        });
      });

      return Promise.all(createPromises);
    });

    return {
      ok: true,
      data: createdIngredients,
    };
  } catch (error) {
    return {
      ok: false,
      error: new Error("Failed to create ingredients", {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}
