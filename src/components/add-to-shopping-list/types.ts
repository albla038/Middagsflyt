export type IngredientSources =
  | {
      type: "scheduled";
      ids: string[]; // List of scheduled recipe IDs
    }
  | {
      type: "recipe";
      ids: string[]; // List of recipe IDs
    };

