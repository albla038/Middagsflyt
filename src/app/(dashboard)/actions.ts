"use server";

import { createSchedule, renameSchedule } from "@/data/schedule/mutations";
import { requireUser } from "@/data/user/verify-user";
import { ActionState } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { z } from "zod/v4";

type FormState = ActionState<
  undefined,
  {
    name?: string[];
    description?: string[];
  }
>;

const saveScheduleSchema = z.object({
  name: z
    .string("Ange ett giltigt namn")
    .min(1, "Namnet måste ha minst en bokstav"),
  description: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.optional(
      z
        .string("Ange en giltig beskrivning")
        .min(1, "Beskrivningen måste ha minst en bokstav"),
    ),
  ),
});

export async function saveSchedule(
  scheduleId: string | undefined,
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUser();

  // Validate the form data
  const validated = saveScheduleSchema.safeParse(Object.fromEntries(formData));

  // Return form errors if validation fails
  if (!validated.success) {
    const errors = z.flattenError(validated.error).fieldErrors;

    return {
      success: false,
      message: "Ogiltig inmatning. Vänligen försök igen",
      errors,
    };
  }

  const { name, description } = validated.data;

  const mutationResult = scheduleId
    ? await renameSchedule({
        scheduleId,
        newName: name,
        description,
      })
    : await createSchedule(name, description);

  // Return error if mutation fails
  if (!mutationResult.ok) {
    return {
      success: false,
      message: `Något gick fel när kalendern ${scheduleId ? "sparades" : "skapades"}, vänligen försök igen!`,
    };
  }

  revalidatePath("/schedule");

  return {
    success: true,
    message: scheduleId ? "Kalender sparad" : "Ny kalender skapad",
  };
}
