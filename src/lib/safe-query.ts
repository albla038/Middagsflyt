import { prismaErrorToErrorCode } from "@/lib/prisma-error-mapper";
import { Result } from "@/lib/types";
import { QueryResult } from "@/lib/types/api";

export async function legacySafeQuery<T>(
  query: () => Promise<T>,
): Promise<Result<T, Error>> {
  try {
    const data = await query();
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export async function safeQuery<T>(
  queryFn: () => Promise<T>,
): Promise<QueryResult<T>> {
  try {
    const data = await queryFn();
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      errorCode: prismaErrorToErrorCode(error),
    };
  }
}
