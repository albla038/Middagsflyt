import { apiClient } from "@/components/add-to-shopping-list/queries/api-client";
import { IngredientSources } from "@/components/add-to-shopping-list/types";
import { useQuery } from "@tanstack/react-query";

export function useRecipeIngredients(
  sources: IngredientSources,
  open: boolean,
) {
  return useQuery({
    queryKey: ["ingredient-sources", sources],
    queryFn: () =>
      apiClient("/api/recipes/ingredients", {
        query: {
          [sources.type === "scheduled" ? "scheduledRecipeIds" : "recipeIds"]:
            sources.ids,
        },
      }),

    enabled: open && sources.ids.length > 0, // Only fetch when dialog is open and there are IDs to fetch
  });
}
