import "server-only";

import { requireHouseholdId } from "@/data/household/queries";
import { generateAndCreateIngredients } from "@/data/ingredient/mutations";
import { fetchMissingIngredients } from "@/data/ingredient/queries";
import { fetchRecipeSlugsByPrefix } from "@/data/recipe/queries";
import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";
import { Recipe } from "@/lib/generated/prisma";
import { prismaErrorToErrorCode } from "@/lib/prisma-error-mapper";
import { safeQuery } from "@/lib/safe-query";
import { RecipeDraft, RecipePublish } from "@/lib/schemas/recipe";
import { GeneratedRecipe } from "@/lib/schemas/recipe-generation";
import { MutationResultData } from "@/lib/types/api";
import { generateUniqueSlug, slugify } from "@/lib/utils";

// HELPER FUNCTIONS
async function resolveUniqueRecipeSlugForName(name: string) {
  const baseSlug = slugify(name);
  // Check if the slug already exists in the database
  const conflictingSlugs = await fetchRecipeSlugsByPrefix(baseSlug);
  const existingSlugs = new Set<string>(conflictingSlugs);
  // Generate a new unique slug based on the baseSlug and existing slugs
  return generateUniqueSlug(baseSlug, existingSlugs);
}

async function buildIngredientNameToCanonicalNameMap(
  ingredientList: string[],
): Promise<Map<string, string>> {
  const nameToCanonicalNameMap = new Map<string, string>();

  // Populate the map with canonical names from the ingredient list
  const directMatches = await prisma.ingredient.findMany({
    where: {
      name: { in: ingredientList },
    },
    select: { name: true },
  });
  for (const ingredient of directMatches) {
    nameToCanonicalNameMap.set(ingredient.name, ingredient.name);
  }

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
  for (const alias of aliasMatches) {
    if (!nameToCanonicalNameMap.has(alias.name)) {
      nameToCanonicalNameMap.set(alias.name, alias.ingredient.name);
    }
  }

  return nameToCanonicalNameMap;
}

// DAL MUTATION FUNCTIONS
export async function createRecipeFromGeneratedData(
  data: GeneratedRecipe,
  sourceUrl: string,
): Promise<MutationResultData<Recipe>> {
  const user = await requireUser();

  try {
    const uniqueSlug = await resolveUniqueRecipeSlugForName(data.name);

    // Prepare ingredients list
    const ingredientList = data.recipeIngredients.map(
      (ingredient) => ingredient.name,
    );

    // Fetch missing ingredients from the DB
    const missingIngredientsRes = await safeQuery(() =>
      fetchMissingIngredients(ingredientList),
    );

    // Return early if there was an error fetching missing ingredients
    if (!missingIngredientsRes.ok) {
      return { ok: false, errorCode: missingIngredientsRes.errorCode };
    }
    const missingIngredients = missingIngredientsRes.data;
    console.log("Missing ingredients:", missingIngredients);

    // If there are missing ingredients, generate and create them
    if (missingIngredients.length > 0) {
      const result = await generateAndCreateIngredients(missingIngredients);
      // Return error code if the ingredient generation failed
      if (!result.ok) {
        return { ok: false, errorCode: "INTERNAL_ERROR" };
      }
    }

    // Create a map to resolve any ingredient name (canonical or alias) to its canonical name.
    const nameToCanonicalNameMap =
      await buildIngredientNameToCanonicalNameMap(ingredientList);

    // Get the household ID for saving the recipe
    const householdId = await requireHouseholdId();

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
            create: {
              household: {
                connect: { id: householdId },
              },
            },
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
            recipe: {
              connect: { id: createdRecipe.id },
            },
            recipeIngredients: {
              connect: ingredientIds,
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

    return { ok: true, data: result };
  } catch (error) {
    console.error("Error creating recipe from generated data:", error);
    return { ok: false, errorCode: prismaErrorToErrorCode(error) };
  }
}

export async function upsertRecipe(
  data: RecipeDraft | RecipePublish,
): Promise<MutationResultData<{ recipeId: string }>> {
  const user = await requireUser();


  try {
    let finalSlug = data.slug;

    // If ID exists, we have an edit
    if (data.id) {
      const existingRecipe = await prisma.recipe.findUnique({
        where: { id: data.id },
        select: { slug: true, name: true, status: true },
      });

      // Generate a new slug if the name has changed, and this is a draft
      if (existingRecipe) {
        if (
          existingRecipe.name !== data.name &&
          existingRecipe.status === "DRAFT"
        ) {
          finalSlug = await resolveUniqueRecipeSlugForName(data.name);
        }
      }
    }

    // If finalSlug is still undefined, we have a brand new recipe draft
    if (!finalSlug) {
      finalSlug = await resolveUniqueRecipeSlugForName(data.name);
    }

    const mappedInstructions = data.recipeInstructions.map((instruction) => {
      const { ingredientIds, ...rest } = instruction;

      return {
        ...rest,
        // Convert string[] to { connect: [{ id: "..." }] }
        recipeIngredients: {
          connect: ingredientIds.map((id) => ({ id })),
        },
      };
    });

    // Save the recipe draft to the database
    const recipe = await prisma.recipe.upsert({
      where: {
        id: data.id ?? "",
      },

      // NEW RECIPE
      create: {
        ...data,
        slug: finalSlug,
        createdBy: { connect: { id: user.id } },

        recipeIngredients: { create: data.recipeIngredients },
        recipeInstructions: { create: mappedInstructions },
      },

      // EDIT RECIPE (wipe & replace)
      update: {
        ...data,
        slug: finalSlug,

        recipeIngredients: {
          deleteMany: {},
          create: data.recipeIngredients,
        },
        recipeInstructions: {
          deleteMany: {},
          create: mappedInstructions,
        },
      },
    });

    return { ok: true, data: { recipeId: recipe.id } };
  } catch (error) {
    console.error("Error saving recipe draft:", error);
    return { ok: false, errorCode: prismaErrorToErrorCode(error) };
  }
}
