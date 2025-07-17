import { Result } from "@/lib/types";

export async function safeQuery<T>(
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
