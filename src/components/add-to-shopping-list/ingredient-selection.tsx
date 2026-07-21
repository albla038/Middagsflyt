import IngredientGroup from "@/components/add-to-shopping-list/ingredient-group";
import IngredientItem from "@/components/add-to-shopping-list/ingredient-item";
import { UIRecipeIngredientsSource } from "@/components/add-to-shopping-list/types";

type IngredientSelectionProps = {
  recipes: UIRecipeIngredientsSource[];
  onToggleGroup: (checked: boolean, sourceId: string) => void;
  onToggleIngredient: (id: string) => void;
};

export default function IngredientSelection({
  recipes,
  onToggleGroup,
  onToggleIngredient,
}: IngredientSelectionProps) {
  return (
    <div className="flex flex-col gap-4">
      {recipes.map((recipe) => (
        <ul key={recipe.sourceId}>
          <IngredientGroup recipe={recipe} onToggleGroup={onToggleGroup}>
            {recipe.recipeIngredients.map((item) => (
              <li key={item.recipeIngredientId}>
                <IngredientItem item={item} onToggle={onToggleIngredient} />
              </li>
            ))}
          </IngredientGroup>
        </ul>
      ))}
    </div>
  );
}
