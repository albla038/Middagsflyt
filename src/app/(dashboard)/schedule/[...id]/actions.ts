"use server";

import {
  createScheduledNote,
  deleteScheduledNote,
  updateScheduledNote,
} from "@/data/scheduled-note/mutations";
import { requireUser } from "@/data/user/verify-user";
import { ActionState } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { z } from "zod/v4";

type SaveFormState = ActionState<
  void,
  {
    noteId?: string[];
    date?: string[];
    scheduleId?: string[];
    title?: string[];
    text?: string[];
  }
>;

const saveScheduledNoteSchema = z.object({
  scheduleId: z.cuid2("Ogiltigt kalender-ID"),
  date: z.date("Ogiltigt datum"),
  noteId: z.cuid2("Ogiltigt anteckings-ID").optional(),
  title: z
    .string("Ange en giltig titel")
    .min(1, "Titeln måste ha minst en bokstav"),
  text: z.preprocess(
    (value) => (value === "" ? null : value),
    z.string("Ange en giltig text").nullable(),
  ),
});

export async function saveScheduledNote(
  scheduleId: string,
  date: Date,
  noteId: string | undefined,
  prevState: SaveFormState,
  formData: FormData,
): Promise<SaveFormState> {
  await requireUser();

  // Validate the IDs and form data
  const validated = saveScheduledNoteSchema.safeParse({
    scheduleId,
    noteId,
    date,
    ...Object.fromEntries(formData),
  });

  // Return form errors if validation fails
  if (!validated.success) {
    const errors = z.flattenError(validated.error).fieldErrors;

    if (errors.date) {
      return {
        success: false,
        message: "Ogiltigt datum. Vänligen kontakta supporten",
        errors,
      };
    }

    if (errors.scheduleId || errors.noteId) {
      return {
        success: false,
        message:
          "Ogiltigt kalender- eller antecknings-ID. Vänligen kontakta supporten",
        errors,
      };
    }

    return {
      success: false,
      message: "Ogiltig inmatning. Vänligen försök igen",
      errors,
    };
  }

  const {
    scheduleId: validatedScheduleId,
    noteId: validatedNoteId,
    date: validatedDate,
    title,
    text,
  } = validated.data;

  const mutationResult = validatedNoteId
    ? await updateScheduledNote({
        noteId: validatedNoteId,
        date: validatedDate,
        title,
        text,
      })
    : await createScheduledNote({
        scheduleId: validatedScheduleId,
        date: validatedDate,
        title,
        text,
      });

  if (!mutationResult.ok) {
    return {
      success: false,
      message: `Något gick fel när anteckningen ${validatedNoteId ? "sparades" : "skapades"}. Vänligen försök igen!`,
    };
  }

  revalidatePath(`/schedule/${scheduleId}`);

  return {
    success: true,
    message: validatedNoteId
      ? "Anteckningen sparades"
      : "Ny anteckning skapades",
  };
}

type DeleteActionState = ActionState<
  void,
  { scheduleId?: string[]; noteId?: string[] }
>;

const deleteScheduledNoteActionSchema = z.object({
  scheduleId: z.cuid2("Ogiltigt kalender-ID"),
  noteId: z.cuid2("Ogiltigt antecknings-ID"),
});

export async function deleteScheduledNoteAction(
  scheduleId: string,
  noteId: string,
): Promise<DeleteActionState> {
  await requireUser();

  // Validate the IDs
  const validated = deleteScheduledNoteActionSchema.safeParse({
    scheduleId,
    noteId,
  });

  // Return error if validation fails
  if (!validated.success) {
    const errors = z.flattenError(validated.error).fieldErrors;

    return {
      success: false,
      message:
        "Ogiltigt kalender- eller antecknings-ID. Vänligen kontakta supporten",
      errors,
    };
  }

  const { scheduleId: validatedScheduleId, noteId: validatedNoteId } =
    validated.data;

  // Delete the scheduled note
  const deleteResult = await deleteScheduledNote(validatedNoteId);

  // Return error if deletion fails
  if (!deleteResult.ok) {
    return {
      success: false,
      message:
        "Något gick fel när anteckningen skulle tas bort. Vänligen försök igen!",
    };
  }

  revalidatePath(`/schedule/${validatedScheduleId}`);

  return {
    success: true,
    message: "Anteckningen togs bort",
  };
}
