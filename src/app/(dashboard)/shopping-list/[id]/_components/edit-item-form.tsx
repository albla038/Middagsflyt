"use client";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShoppingList } from "@/hooks/queries/shopping-list/queries";
import { useIsMobile } from "@/hooks/use-mobile";
import { Unit } from "@/lib/generated/prisma";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShoppingListItemEditForm,
  shoppingListItemEditFormSchema,
} from "@/lib/schemas/shopping-list";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateShoppingListItem } from "@/hooks/queries/shopping-list/mutations";
import { useEffect } from "react";
import { toast } from "sonner";

type EditItemFormProps = {
  listId: string;
  itemId: string | null;
  categories: { id: string; name: string }[];
  onOpenChange: (open: boolean) => void;
};

const unitList = Object.values(Unit);

export default function EditItemForm({
  listId,
  itemId,
  categories,
  onOpenChange,
}: EditItemFormProps) {
  const { data: list, isPending, error } = useShoppingList(listId);
  const item = list?.items.find((item) => item.id === itemId);

  const { mutate: updateItem } = useUpdateShoppingListItem(listId);

  const form = useForm<ShoppingListItemEditForm>({
    resolver: zodResolver(shoppingListItemEditFormSchema),
    defaultValues: item,
  });
  const { formState, reset } = form;

  // Sync form values when item is loaded or changes
  useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item, reset]);

  const isMobile = useIsMobile();

  if (isPending) {
    return <p>Läser in...</p>; // TODO improve all error and loading states
  }

  if (error) {
    return <p className="text-destructive">{error.message}</p>; // TODO improve
  }

  if (!item) {
    return <p>Kunde inte hitta varan...</p>; // TODO improve
  }

  function onSubmit(data: ShoppingListItemEditForm) {
    // Don't do anything if no changes were made
    if (!formState.isDirty) {
      onOpenChange(false);
      return;
    }

    if (item) {
      updateItem({ itemId: item.id, data });
      onOpenChange(false);
    } else {
      toast.error("Något gick fel. Vänligen försök igen.");
    }
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between">
          {isMobile ? (
            <DrawerTitle>Redigera vara</DrawerTitle>
          ) : (
            <DialogTitle>Redigera vara</DialogTitle>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => {}} // TODO Implement delete
          >
            <Trash2 />
            <span>Ta bort</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 gap-x-3">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Namn</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Ange namn"
                    autoFocus
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value === "" ? null : value)
                  }
                  defaultValue={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger className="w-full truncate">
                      <SelectValue placeholder="Övrigt" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Quantity */}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mängd</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step={0.1}
                    min={0}
                    placeholder="Ange mängd"
                    autoComplete="off"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? null : Number(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Unit */}
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enhet</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value === "" ? null : value)
                  }
                  defaultValue={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger className="w-full truncate">
                      <SelectValue placeholder="Välj enhet" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {unitList.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Stäng</Button>
          </DialogClose>
          <Button type="submit" disabled={!formState.isDirty}>
            Spara
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
