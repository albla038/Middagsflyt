"use client";

import DeleteShoppingListAlert from "@/app/(dashboard)/_components/sidebar/shopping-list/delete-alert";
import SaveShoppingListForm from "@/app/(dashboard)/_components/sidebar/shopping-list/save-form";
import { useSortSelection } from "@/app/(dashboard)/shopping-list/sort-selection-provider";
import ResponsiveDialog from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";
import { useShoppingList } from "@/queries/shopping-list/use-shopping-list";
import { Edit, FolderTree, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";

type HeaderMenuProps = {
  listId: string;
};

export default function HeaderMenu({ listId }: HeaderMenuProps) {
  const { data: list } = useShoppingList(listId);

  const { isGroupedByCategory, setGroupedByCategory } = useSortSelection();

  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);

  return (
    <>
      {list && (
        <>
          {/* Edit dialog */}
          <ResponsiveDialog
            open={isEditDialogOpen}
            onOpenChange={setEditDialogOpen}
            title="Redigera inköpslista"
            description={`Byt namn på "${list?.name}"`}
          >
            <SaveShoppingListForm
              list={list}
              onClose={() => setEditDialogOpen(false)}
            />
          </ResponsiveDialog>

          {/* Delete alert */}
          <DeleteShoppingListAlert
            open={isDeleteAlertOpen}
            onOpenChange={setDeleteAlertOpen}
            list={{ ...list, itemCount: list.items.length }}
          />
        </>
      )}

      {/* Item count */}
      <div className="flex grow items-center gap-2">
        <span className="text-muted-foreground">•</span>
        <span className="text-sm font-normal text-muted-foreground">
          {list?.items.length ?? 0}{" "}
          {list?.items.length === 1 ? "vara" : "varor"}
        </span>
      </div>

      {/* Toggle sort */}
      <div className="flex gap-1">
        <Toggle
          className="max-[300px]:hidden"
          pressed={isGroupedByCategory}
          onPressedChange={(pressed) => {
            setGroupedByCategory(pressed);
          }}
        >
          <FolderTree />
        </Toggle>

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuGroup>
              {/* Edit name action */}
              <DropdownMenuItem
                onSelect={() => setTimeout(() => setEditDialogOpen(true), 0)}
              >
                <Edit />
                <span>Byt namn</span>
              </DropdownMenuItem>

              {/* Delete schedule action */}
              <DropdownMenuItem
                onSelect={() => setTimeout(() => setDeleteAlertOpen(true), 0)}
              >
                <Trash2 className="text-destructive" />
                <span>Ta bort lista</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel>Sortera efter</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={isGroupedByCategory ? "categories" : "createdAt"}
                onValueChange={(value) =>
                  setGroupedByCategory(value === "categories")
                }
              >
                <DropdownMenuRadioItem value="categories">
                  Kategori
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="createdAt">
                  Tillagd
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem disabled>
                Skapad{" "}
                {list?.createdAt.toLocaleString("sv-SE", {
                  dateStyle: "medium",
                })}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
