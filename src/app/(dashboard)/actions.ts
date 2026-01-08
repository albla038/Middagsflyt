"use server";

import {
  createSchedule,
  deleteSchedule,
  renameSchedule,
} from "@/data/schedule/mutations";
import { createShoppingList } from "@/data/shopping-list/mutations";
import { requireUser } from "@/data/user/verify-user";
import {
  ShoppingListCreate,
  shoppingListCreateSchema,
} from "@/lib/schemas/shopping-list";
import { ActionResult, ActionState } from "@/lib/types";
import { revalidatePath } from "next/cache";
import z from "zod";

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
    (value) => (value === "" ? null : value),
    z.string("Ange en giltig beskrivning").nullable(),
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

    if (errors.scheduleId) {
      return {
        success: false,
        message: "Ogiltigt kalender-ID. Vänligen kontakta supporten",
        errors,
      };
    }

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
      message: `Något gick fel när kalendern ${scheduleId ? "sparades" : "skapades"}. Vänligen försök igen!`,
    };
  }

  revalidatePath("/schedule");

  return {
    success: true,
    message: scheduleId ? "Kalendern sparades" : "Ny kalender skapades",
  };
}

type DeleteActionState = ActionState<void, void>;

const deleteScheduleSchema = z.cuid2();

export async function deleteScheduleAction(
  scheduleId: string,
): Promise<DeleteActionState> {
  await requireUser();

  // Validate the scheduleId
  const validated = deleteScheduleSchema.safeParse(scheduleId);

  // Return error if validation fails
  if (!validated.success) {
    return {
      success: false,
      message: "Ogiltigt kalender-ID. Vänligen kontakta supporten",
    };
  }

  // Delete the schedule
  const deleteResult = await deleteSchedule(validated.data);

  // Return error if deletion fails
  if (!deleteResult.ok) {
    return {
      success: false,
      message:
        "Något gick fel när kalendern skulle tas bort. Vänligen försök igen!",
    };
  }

  revalidatePath("/schedule");

  return {
    success: true,
    message: "Kalendern togs bort",
  };
}

export async function createShoppingListAction(
  data: ShoppingListCreate,
): Promise<ActionResult<{ id: string }, { name?: string[] }>> {
  await requireUser();

  // Validate name
  const validated = shoppingListCreateSchema.safeParse(data);

  // Return errors if validation fails
  if (!validated.success) {
    const errors = z.flattenError(validated.error).fieldErrors;

    return {
      success: false,
      message: "Ogiltigt namn. Vänligen försök igen",
      errors,
    };
  }

  const createResult = await createShoppingList(validated.data.name);

  // Return error if creation fails
  if (!createResult.ok) {
    return {
      success: false,
      message: "Något gick fel när listan skulle skapas. Vänligen försök igen.",
    };
  }

  revalidatePath("/shopping-list");

  return {
    success: true,
    message: `"${data.name}" skapades`,
    data: { id: createResult.data.id },
  };
}
