import IngredientGroup from "@/app/(dashboard)/_components/add-to-shopping-list-dialog/ingredient-group";
import IngredientItem from "@/app/(dashboard)/_components/add-to-shopping-list-dialog/ingredient-item";
import { UIRecipeIngredientsSource } from "@/app/(dashboard)/_components/add-to-shopping-list-dialog/types";

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
