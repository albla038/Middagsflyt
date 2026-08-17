import { householdMemberSchema } from "@/lib/schemas/household";
import z from "zod";

export const scheduleWithMembersSchema = z.object({
  id: z.cuid2(),
  name: z.string(),
  description: z.string().nullable(),
  members: z.array(householdMemberSchema),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type ScheduleWithMembers = z.infer<typeof scheduleWithMembersSchema>;
