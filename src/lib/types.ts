import {
  ProteinType,
  RecipeType,
  ShoppingList,
  Unit,
} from "@/lib/generated/prisma";
import { User } from "better-auth";

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

export type HouseholdMember = {
  role: string;
  user: User;
};

export type ScheduleWithMembers = {
  id: string;
  name: string;
  description: string | null;
  members: HouseholdMember[];
};

export type ScheduledNoteDisplayContent = {
  id: string;
  date: Date;
  title: string;
  text: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    name: string;
    email: string;
  } | null;
};

export type ScheduledRecipeDisplayContent = {
  id: string;
  date: Date;
  servings: number | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  recipe: {
    id: string;
    slug: string;
    name: string;
    recipeType: RecipeType;
    proteinType: ProteinType | null;
    totalTimeSeconds: number | null;
  };
  assignee: User | null;
};

export type IngredientWithAlias = {
  id: string;
  name: string;
  displayNameSingular: string;
  displayNamePlural: string;
  shoppingUnit: Unit;
  ingredientCategoryId: string;
  ingredientAliases: { name: string }[];
};

export type ShoppingListWithCount = ShoppingList & {
  itemCount: number;
};
