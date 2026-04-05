// Error codes for DAL safe queries
export type QueryErrorCode =
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "VALIDATION_FAILED"
  | "INTERNAL_ERROR";

// Error code for DAL mutations
export type MutationErrorCode =
  | "NOT_FOUND"
  | "CONFLICT"
  | "FORBIDDEN"
  | "VALIDATION_FAILED"
  | "INTERNAL_ERROR";

// Error code for Server Actions
// Add "RATE_LIMITED" and "LOGIC_ERROR"?
export type ActionErrorCode = MutationErrorCode | "UNAUTHORIZED";
