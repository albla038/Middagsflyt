import { Unit } from "@/lib/generated/prisma";

export type Result<Data, Err> =
  | {
      ok: true;
      data: Data;
    }
  | {
      ok: false;
      error: Err;
    };

export type PermissionResult =
  | {
      allowed: true;
    }
  | {
      allowed: false;
      reason: string;
    };

export type ActionState<Data, Err> =
  | {
      success: true;
      message: string;
      data?: Data;
    }
  | {
      success: false;
      message: string;
      errors?: Err;
    }
  | null;

export type ActionResult<Data, Err> =
  | {
      success: true;
      message: string;
      data?: Data;
    }
  | {
      success: false;
      message: string;
      errors?: Err;
    };

export const ORDER_OPTIONS = ["asc", "desc"] as const;
export const SORT_BY_OPTIONS = ["createdAt", "name"] as const;
export const MY_RECIPES_DISPLAY_OPTIONS = ["saved", "created"] as const;

export type Order = (typeof ORDER_OPTIONS)[number];
export type SortBy = (typeof SORT_BY_OPTIONS)[number];
export type MyRecipesDisplay = (typeof MY_RECIPES_DISPLAY_OPTIONS)[number];

export type IngredientWithAlias = {
  id: string;
  name: string;
  displayNameSingular: string;
  displayNamePlural: string;
  shoppingUnit: Unit;
  ingredientCategoryId: string;
  ingredientAliases: { name: string }[];
};

export type IngredientSources =
  | {
      type: "scheduled";
      ids: string[]; // List of scheduled recipe IDs
    }
  | {
      type: "recipe";
      ids: string[]; // List of recipe IDs
    };
