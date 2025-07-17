import "server-only";

import { GeneratedRecipe } from "@/lib/schemas/recipe-generation";
import prisma from "@/lib/db";
import { generateUniqueSlug, slugify } from "@/lib/utils";
import { Result } from "@/lib/types";
import { Recipe } from "@/lib/generated/prisma";
import { fetchMissingIngredients } from "@/data/ingredient/queries";
import { generateAndCreateIngredients } from "@/data/ingredient/mutations";
import { requireUser } from "@/data/user/verify-user";
import { safeQuery } from "@/lib/safe-query";

// TODO Authenticate user in all functions

export async function createRecipeFromGeneratedData(
  data: GeneratedRecipe,
  sourceUrl: string,
): Promise<Result<Recipe, Error>> {
  const user = await requireUser();

  const baseSlug = slugify(data.name);

  try {
    // Check if the slug already exists in the database
    const conflictingSlugRecords = await prisma.recipe.findMany({
      where: {
        slug: {
          startsWith: baseSlug,
        },
      },
      select: {
        slug: true,
      },
    });

    const existingSlugs = new Set<string>(
      conflictingSlugRecords.map((record) => record.slug),
    );
    const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);

    // Prepare ingredients list
    const ingredientList = data.recipeIngredients.map(
      (ingredient) => ingredient.name,
    );

    const missingIngredientsRes = await safeQuery(() =>
      fetchMissingIngredients(ingredientList),
    );
    if (!missingIngredientsRes.ok) {
      return {
        ok: false,
        error: missingIngredientsRes.error,
      };
    }
    const missingIngredients = missingIngredientsRes.data;
    console.log("Missing ingredients:", missingIngredients);

    // If there are missing ingredients, generate and create them
    if (missingIngredients.length > 0) {
      const result = await generateAndCreateIngredients(missingIngredients);
      // If ingredient generation failed, return the error
      if (!result.ok) return result;
    }

    // Create a map to resolve any ingredient name (canonical or alias) to its canonical name.
    const nameToCanonicalNameMap = new Map<string, string>();

    // Populate the map with canonical names from the ingredient list
    const directMatches = await prisma.ingredient.findMany({
      where: {
        name: { in: ingredientList },
      },
      select: { name: true },
    });
    directMatches.forEach((ingredient) =>
      nameToCanonicalNameMap.set(ingredient.name, ingredient.name),
    );

    // Populate the map with aliases that point to canonical names
    const aliasMatches = await prisma.ingredientAlias.findMany({
      where: {
        name: { in: ingredientList },
      },
      select: {
        name: true,
        ingredient: {
          select: { name: true },
        },
      },
    });
    aliasMatches.forEach((alias) => {
      if (!nameToCanonicalNameMap.has(alias.name)) {
        nameToCanonicalNameMap.set(alias.name, alias.ingredient.name);
      }
    });

    // Create the recipe in the database
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the recipe and its recipeIngredients (and connect them to ingredients)
      const createdRecipe = await tx.recipe.create({
        data: {
          slug: uniqueSlug,
          name: data.name,
          description: data.description,
          recipeYield: data.recipeYield,
          recipeType: data.recipeType,
          proteinType: data.proteinType,
          imageUrl: data.imageUrl,

          createdBy: {
            connect: { id: user.id },
          },

          savedBy: {
            create: { user: { connect: { id: user.id } } },
          },

          totalTimeSeconds: data.totalTimeSeconds,
          oven: data.oven,
          originalAuthor: data.originalAuthor,
          isImported: true,
          sourceUrl,

          recipeIngredients: {
            create: data.recipeIngredients.map((record) => {
              const canonicalName = nameToCanonicalNameMap.get(record.name);

              if (!canonicalName) {
                // This should not happen if the ingredient generation worked correctly
                throw new Error(
                  `Could not resolve ingredient name: "${record.name}"`,
                );
              }

              return {
                displayOrder: record.referenceId,
                text: record.text,
                note: record.note,
                quantity: record.quantity,
                unit: record.unit,
                ingredient: {
                  // Connect to the canonical ingredient by canonical name
                  connect: {
                    name: canonicalName,
                  },
                },
              };
            }),
          },
        },
        // Return the recipe ID and recipeIngredients with their IDs and displayOrder
        select: {
          id: true,
          recipeIngredients: { select: { id: true, displayOrder: true } },
        },
      });

      // Map each reference ID (displayOrder) to the corresponding database ID
      // This will be used to connect recipeInstructions to recipeIngredients
      const refIdToDbIdMap = new Map<number, string>();
      createdRecipe.recipeIngredients.forEach((record) =>
        refIdToDbIdMap.set(record.displayOrder, record.id),
      );

      // 2. Create the recipeInstructions and connect them to the recipe and recipeIngredients
      for (const instruction of data.recipeInstructions) {
        // Get the ingredient IDs for this instruction from the refId map
        const ingredientIds = instruction.ingredientIds?.map((refId) => {
          const id = refIdToDbIdMap.get(refId);
          if (!id) {
            // This should not happen if the recipeIngredients were created correctly
            throw new Error(
              `Could not resolve ingredient reference ID: "${refId}"`,
            );
          }
          return { id };
        });

        // Create each recipeInstruction and connect it to the recipe and recipeIngredients
        await tx.recipeInstruction.create({
          data: {
            step: instruction.step,
            text: instruction.text,
            recipeIngredients: {
              connect: ingredientIds,
            },
            recipe: {
              connect: { id: createdRecipe.id },
            },
          },
        });
      }

      // 3. Return the created recipe with its ID
      // Will throw error if the recipe was not found
      // (This ensures that the transaction is rolled back if any part fails)
      return await tx.recipe.findUniqueOrThrow({
        where: { id: createdRecipe.id },
      });
    });

    return {
      ok: true,
      data: result,
    };
  } catch (error) {
    console.error("Error creating recipe:", error);
    return {
      ok: false,
      error: new Error("Failed to create recipe", {
        cause: error instanceof Error ? error : new Error(String(error)),
      }),
    };
  }
}
