import SaveShoppingListForm from "@/app/(dashboard)/_components/sidebar/shopping-list/save-form";
import ResponsiveDialog from "@/components/responsive-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useShoppingList } from "@/hooks/queries/shopping-list/queries";
import { ShoppingListWithCount } from "@/lib/types";
import { Edit, List, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type ShoppingListItemProps = {
  list: ShoppingListWithCount;
};

export default function ShoppingListItem({ list }: ShoppingListItemProps) {
  const pathname = usePathname();

  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const { data } = useShoppingList(list.id);
  const itemCount = data?.items.length ?? list.itemCount;

  return (
    <>
      {/* Edit dialog */}
      <ResponsiveDialog
        open={isEditDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Redigera inköpslista"
        description={`Byt namn på "${list.name}"`}
      >
        <SaveShoppingListForm
          list={list}
          onClose={() => setEditDialogOpen(false)}
        />
      </ResponsiveDialog>

      {/* List item */}
      <SidebarMenuItem>
        <SidebarMenuButton isActive={pathname.includes(list.id)} asChild>
          <Link href={`/shopping-list/${list.id}`}>
            <List /> <span>{list.name}</span>
          </Link>
        </SidebarMenuButton>

        {/* Dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction>
              <MoreHorizontal />
            </SidebarMenuAction>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="right" align="start">
            {/* Edit name action */}
            <DropdownMenuItem
              onSelect={() => setTimeout(() => setEditDialogOpen(true), 0)}
            >
              <Edit />
              <span>Byt namn</span>
            </DropdownMenuItem>

            {/* Delete schedule action */}
            <DropdownMenuItem
            // onSelect={() =>
            //   setTimeout(() => , 0)
            // }
            >
              <Trash2 className="text-destructive" />
              <span>Ta bort lista</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

          <SidebarMenuBadge className="right-7 border border-sidebar-border">
            {itemCount}
          </SidebarMenuBadge>
        
      </SidebarMenuItem>
    </>
  );
}
