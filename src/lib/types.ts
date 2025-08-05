import { ProteinType } from "@/lib/generated/prisma";

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

export type ActionState<Err> =
  | { status: "IDLE" }
  | {
      status: "SUCCESS";
      message: string;
    }
  | {
      status: "ERROR";
      message: string;
      errors?: Err;
    };

export type RecipeDisplayContent = {
  id: string;
  name: string;
  slug: string;
  recipeYield: number | null;
  imageUrl: string | null;
  proteinType: ProteinType | null;
  totalTimeSeconds: number | null;
  isSaved: boolean;
  isImported?: boolean;
  isCreatedByUser?: boolean;
  scheduledDate?: Date;
};

export const ORDER_OPTIONS = ["asc", "desc"] as const;
export const SORT_BY_OPTIONS = ["createdAt", "name"] as const;
export const MY_RECIPES_DISPLAY_OPTIONS = ["saved", "created"] as const;

export type Order = (typeof ORDER_OPTIONS)[number];
export type SortBy = (typeof SORT_BY_OPTIONS)[number];
export type MyRecipesDisplay = (typeof MY_RECIPES_DISPLAY_OPTIONS)[number];
