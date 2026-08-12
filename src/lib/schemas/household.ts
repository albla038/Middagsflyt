import { HouseholdRole } from "@/lib/generated/prisma";
import { userSchema } from "@/lib/schemas/user";
import z from "zod";

export const householdMemberSchema = z.object({
  user: userSchema,
  role: z.enum(HouseholdRole),
});

export type HouseholdMember = z.infer<typeof householdMemberSchema>;
