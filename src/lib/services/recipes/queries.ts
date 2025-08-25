import { API_BASE_URL } from "@/lib/constants";
import { recipeDisplayContentSchema } from "@/lib/schemas/recipe";
import { Order, SortBy } from "@/lib/types";

export async function fetchSavedRecipes({
  query,
  order = "desc",
  sort = "createdAt",
}: {
  query: string;
  order?: Order;
  sort?: SortBy;
}) {
  const searchParams = new URLSearchParams({ query, order, sort });

  // Fetch the data
  const response = await fetch(
    `${API_BASE_URL}/api/recipes/saved?${searchParams.toString()}`,
  );

  // Throw error if response is not ok
  if (!response.ok) {
    throw new Error(
      `HTTP error ${response.status} ${response.statusText}`,
      //  { cause: await response.json() }
    );
  }

  const data = await response.json();

  // Validate the data
  const validated = recipeDisplayContentSchema.safeParse(data);

  // Throw error if validation fails
  if (!validated.success) {
    throw new Error(
      `Något gick fel när sparade recept skulle hämtas. Vänlig försök igen!`,
    );
  }

  return validated.data;
}
