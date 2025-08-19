"use server";

import {
  createSchedule,
  deleteSchedule,
  renameSchedule,
} from "@/data/schedule/mutations";
import { requireUser } from "@/data/user/verify-user";
import { ActionState, Result } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { z } from "zod/v4";

type SaveFormState = ActionState<
  void,
  {
    scheduleId?: string[];
    name?: string[];
    description?: string[];
  }
>;

const saveScheduleSchema = z.object({
  scheduleId: z.cuid2("Ogiltigt kalender-ID").optional(),
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
  id: string | undefined,
  prevState: SaveFormState,
  formData: FormData,
): Promise<SaveFormState> {
  await requireUser();

  // Validate the form data
  const validated = saveScheduleSchema.safeParse({
    scheduleId: id,
    ...Object.fromEntries(formData),
  });

  // Return form errors if validation fails
  if (!validated.success) {
    const errors = z.flattenError(validated.error).fieldErrors;

    return {
      success: false,
      message: "Ogiltig inmatning. Vänligen försök igen",
      errors,
    };
  }

  const { scheduleId, name, description } = validated.data;

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

const deleteScheduleSchema = z.cuid2();

export async function deleteScheduleAction(
  scheduleId: string,
): Promise<Result<void, Error>> {
  await requireUser();

  // Validate the scheduleId
  const validated = deleteScheduleSchema.safeParse(scheduleId);

  // Return error if validation fails
  if (!validated.success) {
    return {
      ok: false,
      error: new Error("Invalid schedule ID provided", {
        cause: validated.error,
      }),
    };
  }

  // Delete the schedule
  const deleteResult = await deleteSchedule(validated.data);

  // Return error if deletion fails
  if (!deleteResult.ok) {
    return {
      ok: false,
      error: new Error(`Failed to delete schedule with ID: ${validated.data}`, {
        cause: deleteResult.error,
      }),
    };
  }

  revalidatePath("/schedule");

  return {
    ok: true,
    data: undefined,
  };
}
