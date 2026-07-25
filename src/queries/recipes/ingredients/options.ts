import { apiClient } from "@/queries/api-client";
import { IngredientSources } from "@/lib/types";
import { queryOptions } from "@tanstack/react-query";

export function recipeIngredientsQueryOptions(sources: IngredientSources) {
  return queryOptions({
    queryKey: ["ingredient-sources", sources],
    queryFn: () =>
      apiClient("/api/recipes/ingredients", {
        query: {
          [sources.type === "scheduled" ? "scheduledRecipeIds" : "recipeIds"]:
            sources.ids,
        },
      }),
  });
}
