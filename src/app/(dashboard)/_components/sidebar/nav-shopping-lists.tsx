"use client";

import CreateShoppingListForm from "@/app/(dashboard)/_components/sidebar/create-shopping-list-form";
import ResponsiveDialog from "@/components/responsive-dialog";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShoppingList } from "@/lib/generated/prisma";
import { List, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use, useState } from "react";

type NavShoppingListsProps = {
  shoppingListsData: Promise<ShoppingList[]>;
};

export default function NavShoppingLists({
  shoppingListsData,
}: NavShoppingListsProps) {
  const pathname = usePathname();

  const shoppingLists = use(shoppingListsData);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <>
      <ResponsiveDialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          if (!open) setCreateDialogOpen(false);
        }}
        title="Skapa ny inköpslista"
        description="Listan delas automatisk med alla medlemmar i ditt hushåll" // TODO Check
      >
        <CreateShoppingListForm />
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
              <SidebarMenuItem key={list.id}>
                <SidebarMenuButton
                  isActive={pathname.includes(list.id)}
                  asChild
                >
                  <Link href={`/shopping-list/${list.id}`}>
                    <List /> <span>{list.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
