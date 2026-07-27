"use client";

import { deleteShoppingListAction } from "@/app/(dashboard)/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { getActionErrorMessage } from "@/lib/error-messages";
import { getQueryClient } from "@/lib/query-client";
import { ShoppingListWithCount } from "@/lib/schemas/shopping-list";
import { shoppingListsQueryOptions } from "@/queries/shopping-list/options";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const queryClient = getQueryClient();

type DeleteShoppingListAlertProps = {
  list: ShoppingListWithCount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DeleteShoppingListAlert({
  open,
  onOpenChange,
  list,
}: DeleteShoppingListAlertProps) {
  const [isPending, startTransition] = useTransition();

  const params = useParams<{ id: string }>();
  const router = useRouter();

  function onDelete() {
    startTransition(async () => {
      const result = await deleteShoppingListAction({ listId: list.id });

      if (!result.success) {
        const errorMessage = getActionErrorMessage(result.errorCode);
        toast.error(errorMessage);
        return;
      }

      queryClient.invalidateQueries({
        queryKey: shoppingListsQueryOptions().queryKey,
      });

      onOpenChange(false);
      toast.success(`"${list.name}" togs bort`);

      if (params.id === list.id) {
        router.replace("/saved-recipes");
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Vill du ta bort &quot;{list.name}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription className="grid gap-2">
            Inköpslistan innehåller {list.itemCount}{" "}
            {list.itemCount === 1 ? "vara" : "varor"}. Denna åtgärd kan inte
            ångras.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Avbryt</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={isPending}>
            {isPending ? (
              <>
                <Spinner /> <span>Tar bort...</span>
              </>
            ) : (
              <span>Ja, ta bort</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
