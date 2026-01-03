import z from "zod";

export const responseSchema = z.object({
  message: z.string(),
});

export const zodErrorResponseSchema = z.object({
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string()).optional()).optional(),
});
