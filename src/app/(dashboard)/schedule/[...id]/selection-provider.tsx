"use client";

import {
  ActionDispatch,
  createContext,
  ReactNode,
  use,
  useReducer,
} from "react";

type SelectedRecipe = {
  id: string;
  name: string;
};

type SelectionState = {
  [scheduleId: string]: SelectedRecipe[];
};

type Action =
  | {
      type: "TOGGLE_RECIPE";
      payload: { scheduleId: string; scheduledRecipe: SelectedRecipe };
    }
  | {
      type: "SELECT_MULTIPLE";
      payload: { scheduleId: string; scheduledRecipes: SelectedRecipe[] };
    }
  | {
      type: "CLEAR_ALL";
      payload: { scheduleId: string };
    };

function selectionReducer(
  state: SelectionState,
  action: Action,
): SelectionState {
  const { type, payload } = action;

  switch (type) {
    case "TOGGLE_RECIPE": {
      const { scheduleId, scheduledRecipe } = payload;

      // Get current selection for the schedule, or empty array if none
      const currentSelection = state[scheduleId] ?? [];

      // 1. Check if the recipe is already selected
      const isSelected = currentSelection.some(
        (recipe) => recipe.id === scheduledRecipe.id,
      );

      // 2. Add or remove (toggle) scheduled recipe to/from selection array
      const newSelection = isSelected
        ? currentSelection.filter((recipe) => recipe.id !== scheduledRecipe.id)
        : [...currentSelection, scheduledRecipe];

      return {
        ...state,
        [scheduleId]: newSelection,
      };
    }

    case "SELECT_MULTIPLE": {
      const { scheduleId, scheduledRecipes } = payload;

      // Get current selection for the schedule, or empty array if none
      const currentSelection = state[scheduleId] ?? [];

      // 1. Create a set of existing IDs
      const existingIds = new Set(currentSelection.map((recipe) => recipe.id));

      // 2. Filter out duplicates from the incoming recipes
      const selectionsToAdd = scheduledRecipes.filter(
        (recipe) => !existingIds.has(recipe.id),
      );

      // 3. Combine current selection with new unique selections
      const newSelection = [...currentSelection, ...selectionsToAdd];

      return {
        ...state,
        [scheduleId]: newSelection,
      };
    }

    case "CLEAR_ALL": {
      return {
        ...state,
        [payload.scheduleId]: [],
      };
    }

    default: {
      throw new Error("Unknown reducer action!");
    }
  }
}

type SelectionContext = [SelectionState, ActionDispatch<[action: Action]>];

export const SelectionContext = createContext<SelectionContext | undefined>(
  undefined,
);

export default function SelectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const value = useReducer(selectionReducer, {});

  return <SelectionContext value={value}>{children}</SelectionContext>;
}

export function useSelection() {
  const context = use(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }

  return context;
}
