import {
  IngredientContent,
  InstructionContent,
} from "@/components/recipe/types";
import { useReducer } from "react";

type ContentState = {
  ingredients: (IngredientContent & {
    isChecked: boolean;
    isMuted: boolean;
  })[];
  instructions: (InstructionContent & {
    isChecked: boolean;
  })[];
};

type ContentAction =
  | {
      type: "CHECK_INGREDIENT";
      payload: { id: string };
    }
  | {
      type: "CHECK_INSTRUCTION";
      payload: {
        id: string;
        ingredientIds: string[];
        checked: boolean;
      };
    }
  | {
      type: "HOVER_INSTRUCTION";
      payload: { ingredientIds: string[] };
    }
  | {
      type: "CLEAR_HOVER";
    };

function contentReducer(
  state: ContentState,
  action: ContentAction,
): ContentState {
  switch (action.type) {
    case "CHECK_INGREDIENT":
      return {
        ...state,
        ingredients: state.ingredients.map((ingredient) =>
          ingredient.id === action.payload.id
            ? { ...ingredient, isChecked: !ingredient.isChecked }
            : ingredient,
        ),
      };

    case "CHECK_INSTRUCTION":
      return {
        ...state,
        instructions: state.instructions.map((instruction) =>
          instruction.id === action.payload.id
            ? { ...instruction, isChecked: !instruction.isChecked }
            : instruction,
        ),
        ingredients: state.ingredients.map((ingredient) =>
          action.payload.ingredientIds.includes(ingredient.id)
            ? { ...ingredient, isChecked: action.payload.checked }
            : ingredient,
        ),
      };

    case "HOVER_INSTRUCTION":
      const { ingredientIds } = action.payload;
      if (ingredientIds.length === 0) return state;

      const ingredientIdSet = new Set(ingredientIds);

      const shouldHighlight = state.ingredients.some(
        (ingredient) =>
          ingredientIdSet.has(ingredient.id) && !ingredient.isChecked,
      );

      if (shouldHighlight) {
        return {
          ...state,
          ingredients: state.ingredients.map((ingredient) => ({
            ...ingredient,
            isMuted: !ingredientIds.includes(ingredient.id),
          })),
        };
      }

      return state;

    case "CLEAR_HOVER":
      return {
        ...state,
        ingredients: state.ingredients.map((ingredient) => ({
          ...ingredient,
          isMuted: false,
        })),
      };

    default:
      throw new Error("Unknown reducer action!");
  }
}

function createInitialState({
  ingredients,
  instructions,
}: {
  ingredients: IngredientContent[];
  instructions: InstructionContent[];
}): ContentState {
  return {
    ingredients: ingredients.map((ingredient) => ({
      ...ingredient,
      isChecked: false,
      isMuted: false,
    })),
    instructions: instructions.map((instruction) => ({
      ...instruction,
      isChecked: false,
    })),
  };
}

export function useRecipeContentState(
  ingredients: IngredientContent[],
  instructions: InstructionContent[],
) {
  const [state, dispatch] = useReducer(
    contentReducer,
    { ingredients, instructions },
    createInitialState,
  );

  return { state, dispatch };
}
