// Error code for DAL operations (queries and mutations)
export type ErrorCode =
  | "NOT_FOUND"
  | "CONFLICT"
  | "FORBIDDEN"
  | "VALIDATION_FAILED"
  | "INTERNAL_ERROR";

// Error code for Server Actions
export type ActionErrorCode = ErrorCode | "UNAUTHORIZED";
