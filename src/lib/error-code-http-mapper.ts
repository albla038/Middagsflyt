import { ErrorCode } from "@/lib/types/error-codes";

export function errorCodeToHttpStatus(code: ErrorCode): number {
  switch (code) {
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
      return 409;
    case "FORBIDDEN":
      return 403;
    case "VALIDATION_FAILED":
      return 400;
    case "INTERNAL_ERROR":
    default:
      return 500;
  }
}
