"use server";

import {
  createScheduledNote,
  deleteScheduledNote,
  updateScheduledNote,
} from "@/data/scheduled-note/mutations";
import {
  deleteScheduledRecipe,
  updateScheduledRecipeAssignee,
} from "@/data/scheduled-recipe/mutations";
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
  noteId: z.cuid2("Ogiltigt antecknings-ID").optional(),
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

type DeleteNoteActionState = ActionState<
  void,
  { scheduleId?: string[]; noteId?: string[] }
>;

const deleteScheduledNoteActionSchema = z.object({
  scheduleId: z.cuid2("Ogiltigt kalender-ID"),
  noteId: z.cuid2("Ogiltigt antecknings-ID"),
});

export async function deleteScheduledNoteAction({
  scheduleId,
  noteId,
}: {
  scheduleId: string;
  noteId: string;
}): Promise<DeleteNoteActionState> {
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

type UpdateAssigneeState = ActionState<
  void,
  {
    scheduledRecipeId?: string[];
    assigneeId?: string[];
  }
>;

const updateAssigneeSchema = z.object({
  scheduledRecipeId: z.cuid2("Ogiltigt recept-ID"),
  assigneeId: z.string("Ogiltigt användar-ID").nullable(),
  scheduleId: z.cuid2("Ogiltigt kalender-ID"),
});

export async function updateAssignee({
  scheduledRecipeId,
  assigneeId,
  scheduleId,
}: {
  scheduledRecipeId: string;
  assigneeId: string | null;
  scheduleId: string;
}): Promise<UpdateAssigneeState> {
  await requireUser();

  console.log("Received assignee ID:", assigneeId);

  // Validate the IDs
  const validated = updateAssigneeSchema.safeParse({
    scheduledRecipeId,
    assigneeId,
    scheduleId,
  });

  // Return error if validation fails
  if (!validated.success) {
    const errors = z.flattenError(validated.error).fieldErrors;
    console.log(errors);

    return {
      success: false,
      message:
        "Ogiltigt recept-, kalender- eller användar-ID. Vänligen kontakta supporten",
      errors,
    };
  }

  const {
    scheduledRecipeId: validatedScheduledRecipeId,
    assigneeId: validatedAssigneeId,
    scheduleId: validatedScheduleId,
  } = validated.data;

  const mutationResult = await updateScheduledRecipeAssignee({
    scheduledRecipeId: validatedScheduledRecipeId,
    assigneeId: validatedAssigneeId,
  });

  // Return error if mutation fails
  if (!mutationResult.ok) {
    return {
      success: false,
      message:
        "Något gick fel när schemaläggningens ansvariga person skulle uppdateras. Vänligen försök igen!",
    };
  }

  revalidatePath(`/schedule/${validatedScheduleId}`);

  return {
    success: true,
    message: "Schemaläggningen uppdaterades",
  };
}

type DeleteRecipeActionState = ActionState<
  void,
  { scheduledRecipeId?: string[]; scheduleId?: string[] }
>;

const deleteScheduledRecipeActionSchema = z.object({
  scheduledRecipeId: z.cuid2("Ogiltigt recept-ID"),
  scheduleId: z.cuid2("Ogiltigt kalender-ID"),
});

export async function deleteScheduledRecipeAction({
  scheduledRecipeId,
  scheduleId,
}: {
  scheduledRecipeId: string;
  scheduleId: string;
}): Promise<DeleteRecipeActionState> {
  await requireUser();

  // Validate the IDs
  const validated = deleteScheduledRecipeActionSchema.safeParse({
    scheduledRecipeId,
    scheduleId,
  });

  // Return error if validation fails
  if (!validated.success) {
    const errors = z.flattenError(validated.error).fieldErrors;

    return {
      success: false,
      message:
        "Ogiltigt recept- eller kalender-ID. Vänligen kontakta supporten",
      errors,
    };
  }

  const {
    scheduledRecipeId: validatedScheduledRecipeId,
    scheduleId: validatedScheduleId,
  } = validated.data;

  // Delete the scheduled recipe
  const deleteResult = await deleteScheduledRecipe(validatedScheduledRecipeId);

  // Return error if deletion fails
  if (!deleteResult.ok) {
    return {
      success: false,
      message:
        "Något gick fel när det schemaläggningen skulle tas bort. Vänligen försök igen!",
    };
  }

  revalidatePath(`/schedule/${validatedScheduleId}`);

  return {
    success: true,
    message: "Schemaläggningen togs bort",
  };
}
