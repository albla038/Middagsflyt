import { emptyStringToNull } from "@/lib/utils";
import z from "zod";

// Schema for form validation of scheduling a recipe
export const scheduleRecipeFormSchema = z.object({
  recipeId: z.cuid2(),
  scheduleId: z.cuid2(),
  date: z.date("Ange ett giltigt datum"),
  servings: z.number().min(1, "Antal portioner måste vara minst 1"),
  assigneeId: z.string().pipe(z.transform(emptyStringToNull)),
  note: z.string().pipe(z.transform(emptyStringToNull)),
});

export type ScheduleRecipeFormInput = z.input<typeof scheduleRecipeFormSchema>;
export type ScheduleRecipeForm = z.infer<typeof scheduleRecipeFormSchema>;

export const scheduleRecipeCreateSchema = scheduleRecipeFormSchema.extend({
  assigneeId: z.string().nullable(),
  note: z.string().nullable(),
});

export type ScheduleRecipeCreate = z.infer<typeof scheduleRecipeCreateSchema>;
