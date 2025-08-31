import { z } from "zod/v4";

export const ErrorResponseSchema = z.object({
  message: z.string(),
});