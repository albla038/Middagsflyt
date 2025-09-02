import { Unit } from "@/lib/generated/prisma";
import { z } from "zod/v4";

const shoppingListItemSchema = z.object({
  id: z.cuid2(),
  name: z.string(),
  quantity: z.number().nullable(),
  unit: z.enum(Unit).nullable(),
  displayOrder: z.number().nullable(),
  isPurchased: z.boolean(),
  isManuallyEdited: z.boolean(),
});

export const shoppingListResponseSchema = z.object({
  id: z.cuid2(),
  name: z.string(),
  items: z.array(shoppingListItemSchema),
});

export type ShoppingListItem = z.infer<typeof shoppingListItemSchema>;
export type ShoppingListResponse = z.infer<typeof shoppingListResponseSchema>;
