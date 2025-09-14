import { Unit } from "@/lib/generated/prisma";
import { z } from "zod/v4";

const shoppingListItemResponseSchema = z.object({
  id: z.cuid2(),
  name: z.string(),
  quantity: z.number().nullable(),
  unit: z.enum(Unit).nullable(),
  displayOrder: z.number().nullable(),
  isPurchased: z.boolean(),
  isManuallyEdited: z.boolean(),

  createdAt: z.iso.datetime().transform((str) => new Date(str)),
  updatedAt: z.iso.datetime().transform((str) => new Date(str)),

  // Relations
  category: z
    .object({
      id: z.cuid2(),
      name: z.string(),
    })
    .nullable(),
  // TODO Add more relations
});

export type ShoppingListItemResponse = z.infer<
  typeof shoppingListItemResponseSchema
>;

export const shoppingListResponseSchema = z.object({
  id: z.cuid2(),
  name: z.string(),
  items: z.array(shoppingListItemResponseSchema),
});

export type ShoppingListResponse = z.infer<typeof shoppingListResponseSchema>;

export const shoppingListItemCreateSchema = z.object({
  id: z.cuid2(),
  name: z.string().min(1, "Varans namn måste ha minst en bokstav"),
  quantity: z.number().nullable(),
  unit: z.enum(Unit).nullable(),
  displayOrder: z.number().nullable(),

  // TODO Add Relations
  // categoryId: z.cuid2().nullable(),
});

export type ShoppingListItemCreate = z.infer<
  typeof shoppingListItemCreateSchema
>;

export const shoppingListItemUpdateSchema = z.object({
  name: z
    .string("Ange ett giltigt namn")
    .min(1, "Namnet måste ha minst en bokstav")
    .max(50, "Namnet får ha max 50 bokstäver")
    .optional(),
  quantity: z.number().positive("Ange en positiv mängd").nullable().optional(),
  unit: z.enum(Unit).nullable().optional(),
  displayOrder: z.number().nullable().optional(),
  isPurchased: z.boolean().optional(),

  // TODO Add Relations
  categoryId: z.cuid2().nullable().optional(),
});

export type ShoppingListItemUpdate = z.infer<
  typeof shoppingListItemUpdateSchema
>;

export const shoppingListItemEditFormSchema = z.object({
  name: z
    .string("Ange ett giltigt namn")
    .min(1, "Namnet måste ha minst en bokstav")
    .max(50, "Namnet får ha max 50 bokstäver"),
  quantity: z.number().positive("Ange en positiv mängd").nullable(),
  unit: z.enum(Unit).nullable(),

  // TODO Add Relations
  categoryId: z.cuid2().nullable().optional(),
});

export type ShoppingListItemEditForm = z.infer<
  typeof shoppingListItemEditFormSchema
>;
