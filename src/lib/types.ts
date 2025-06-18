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

export type ActionResponse<Data> =
  | {
      ok: true;
      data: Data;
    }
  | {
      ok: false;
      message: string;
    };
