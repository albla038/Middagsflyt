"use client";

import SaveShoppingListForm from "@/app/(dashboard)/_components/sidebar/shopping-list/save-form";
import ShoppingListItem from "@/app/(dashboard)/_components/sidebar/shopping-list/list-item";
import ResponsiveDialog from "@/components/responsive-dialog";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShoppingListWithCount } from "@/lib/types";
import { Plus } from "lucide-react";
import { use, useState } from "react";

type NavShoppingListsProps = {
  shoppingListsPromise: Promise<ShoppingListWithCount[]>;
};

export default function NavShoppingLists({
  shoppingListsPromise,
}: NavShoppingListsProps) {
  const shoppingLists = use(shoppingListsPromise);

  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <>
      {/* Create dialog */}
      <ResponsiveDialog
        open={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        title="Skapa ny inköpslista"
        description="Listan delas automatisk med alla medlemmar i ditt hushåll"
      >
        <SaveShoppingListForm onClose={() => setCreateDialogOpen(false)} />
      </ResponsiveDialog>

      <SidebarGroup>
        <SidebarGroupLabel>Inköpslistor</SidebarGroupLabel>

        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <SidebarGroupAction onClick={() => setCreateDialogOpen(true)}>
              <Plus /> <span className="sr-only">Ny inköpslista</span>
            </SidebarGroupAction>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Ny inköpslista</p>
          </TooltipContent>
        </Tooltip>

        <SidebarGroupContent>
          <SidebarMenu>
            {shoppingLists.map((list) => (
              <ShoppingListItem key={list.id} list={list} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
