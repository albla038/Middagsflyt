import { Prisma } from "@/lib/generated/prisma/client";
import { MutationErrorCode } from "@/lib/types/error-codes";

export function prismaErrorToMutationErrorCode(
  error: unknown,
): MutationErrorCode {
  // 1. Handle specific known Prisma errors (Constraints, Not Found, etc.)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        // "Unique constraint failed" - e.g., trying to register an existing email
        return "CONFLICT";

      case "P2025":
        // "An operation failed because it depends on one or more records that were required but not found"
        return "NOT_FOUND";

      case "P2003":
        // "Foreign key constraint failed" - e.g., deleting a user who has undeleted posts
        return "CONFLICT";

      case "P2014":
        // "The change you are trying to make would violate the required relation"
        return "CONFLICT";

      default:
        console.error(`Unhandled Prisma error code: ${error.code}`, error);
        return "INTERNAL_ERROR";
    }
  }

  // 2. Handle Prisma validation errors (e.g., missing required fields, wrong types)
  if (error instanceof Prisma.PrismaClientValidationError) {
    console.error("Prisma validation error:", error);
    return "VALIDATION_FAILED";
  }

  // 3. Handle Prisma initialization/connection errors
  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientUnknownRequestError
  ) {
    console.error("Prisma critical error:", error);
    return "INTERNAL_ERROR";
  }

  // 4. Absolute fallback for non-Prisma errors
  return "INTERNAL_ERROR";
}
