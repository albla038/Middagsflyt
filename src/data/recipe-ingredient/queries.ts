import "server-only";
import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";
import { RecipeIngredientsSource } from "@/lib/schemas/recipe-ingredient";

export async function fetchRecipeIngredientsForShoppingList(
  recipeIds?: string[],
  scheduledRecipeIds?: string[],
): Promise<Record<string, RecipeIngredientsSource>> {
  const user = await requireUser();

  try {
    const recipesPromise =
      recipeIds && recipeIds.length > 0
        ? prisma.recipe.findMany({
            where: {
              id: { in: recipeIds },
            },

            select: {
              id: true,
              name: true,
              recipeYield: true,

              // Include recipe ingredients
              recipeIngredients: {
                select: {
                  id: true,
                  text: true,
                  note: true,
                  quantity: true,
                  unit: true,

                  // Include base ingredient
                  ingredient: {
                    select: {
                      id: true,
                      name: true,
                      displayNameSingular: true,
                      displayNamePlural: true,
                    },
                  },
                },
                orderBy: { displayOrder: "asc" },
              },
            },
          })
        : [];

    const scheduledRecipesPromise =
      scheduledRecipeIds && scheduledRecipeIds.length > 0
        ? prisma.scheduledRecipe.findMany({
            where: {
              schedule: {
                household: {
                  members: {
                    some: { userId: user.id },
                  },
                },
              },
              id: { in: scheduledRecipeIds },
            },

            select: {
              id: true,
              servings: true,

              recipe: {
                select: {
                  id: true,
                  name: true,
                  recipeYield: true,

                  // Include recipe ingredients
                  recipeIngredients: {
                    select: {
                      id: true,
                      text: true,
                      note: true,
                      quantity: true,
                      unit: true,

                      // Include base ingredient
                      ingredient: {
                        select: {
                          id: true,
                          name: true,
                          displayNameSingular: true,
                          displayNamePlural: true,
                        },
                      },
                    },
                    orderBy: { displayOrder: "asc" },
                  },
                },
              },
            },
          })
        : [];

    // Run both queries in parallel
    const [recipeSources, scheduledRecipeSources] = await Promise.all([
      recipesPromise,
      scheduledRecipesPromise,
    ]);

    let result: Record<string, RecipeIngredientsSource> = {};

    recipeSources.forEach((recipe) => {
      result[recipe.id] = {
        sourceId: recipe.id,
        sourceType: "RECIPE",
        name: recipe.name,
        baseServings: recipe.recipeYield,

        recipeIngredients: recipe.recipeIngredients.map((recipeIng) => ({
          recipeIngredientId: recipeIng.id,
          text: recipeIng.text,
          note: recipeIng.note,
          quantity: recipeIng.quantity,
          unit: recipeIng.unit,

          // From ingredient relation
          ingredientId: recipeIng.ingredient.id,
          name: recipeIng.ingredient.name,
          displayNameSingular: recipeIng.ingredient.displayNameSingular,
          displayNamePlural: recipeIng.ingredient.displayNamePlural,
        })),
      };
    });

    scheduledRecipeSources.forEach((scheduled) => {
      result[scheduled.id] = {
        sourceId: scheduled.id,
        sourceType: "SCHEDULED",
        name: scheduled.recipe.name,
        servings: scheduled.servings,
        baseServings: scheduled.recipe.recipeYield,

        recipeIngredients: scheduled.recipe.recipeIngredients.map(
          (recipeIng) => ({
            recipeIngredientId: recipeIng.id,
            text: recipeIng.text,
            note: recipeIng.note,
            quantity: recipeIng.quantity,
            unit: recipeIng.unit,

            // From ingredient relation
            ingredientId: recipeIng.ingredient.id,
            name: recipeIng.ingredient.name,
            displayNameSingular: recipeIng.ingredient.displayNameSingular,
            displayNamePlural: recipeIng.ingredient.displayNamePlural,
          }),
        ),
      };
    });

    return result;
  } catch (error) {
    throw new Error("Failed to fetch recipe ingredients from recipe IDs", {
      cause: error instanceof Error ? error : new Error(String(error)),
    });
  }
}
