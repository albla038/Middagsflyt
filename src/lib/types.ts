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

export const ORDER_OPTIONS = ["asc", "desc"] as const;
export const SORT_BY_OPTIONS = ["createdAt", "name"] as const;

export type Order = (typeof ORDER_OPTIONS)[number];
export type SortBy = (typeof SORT_BY_OPTIONS)[number];
