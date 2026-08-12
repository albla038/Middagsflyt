import IngredientGroup from "@/components/add-to-shopping-list-dialog/ingredient-group";
import IngredientItem from "@/components/add-to-shopping-list-dialog/ingredient-item";
import { UIRecipeIngredientsSource } from "@/components/add-to-shopping-list-dialog/types";
import ServingsControl from "@/components/servings-control";

type IngredientSelectionProps = {
  recipes: UIRecipeIngredientsSource[];
  onToggleGroup: (checked: boolean, sourceId: string) => void;
  onToggleIngredient: (id: string) => void;
  onServingsChange: (sourceId: string, newServings: number) => void;
};

export default function IngredientSelection({
  recipes,
  onToggleGroup,
  onToggleIngredient,
  onServingsChange,
}: IngredientSelectionProps) {
  return (
    <div className="flex flex-col gap-4">
      {recipes.map((recipe) => (
        <ul key={recipe.sourceId}>
          <IngredientGroup recipe={recipe} onToggleGroup={onToggleGroup}>
            <div className="bg-subtle rounded-lg p-1 w-fit my-2">
              <ServingsControl
                servings={recipe.selectedServings}
                onServingsChange={(value) => {
                  onServingsChange(recipe.sourceId, value);
                }}
                defaultServings={recipe.baseServings ?? 4}
              />
            </div>

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
