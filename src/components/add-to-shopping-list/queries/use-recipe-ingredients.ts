import { apiClient } from "@/components/add-to-shopping-list/queries/api-client";
import { IngredientSources } from "@/components/add-to-shopping-list/types";
import { useQuery } from "@tanstack/react-query";

export function useRecipeIngredients(sources: IngredientSources) {
  return useQuery({
    queryKey: ["ingredient-sources", sources],
    queryFn: async () => {
      return await apiClient("/api/recipes/ingredients", {
        query: {
          [sources.type === "scheduled" ? "scheduledRecipeIds" : "recipeIds"]:
            sources.ids,
        },
      });
    },
    enabled: sources.ids.length > 0,
  });
}
