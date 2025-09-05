"use client";

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
import { use } from "react";

type NavShoppingListsProps = {
  shoppingListsData: Promise<ShoppingList[]>;
};

export default function NavShoppingLists({
  shoppingListsData,
}: NavShoppingListsProps) {
  const pathname = usePathname();

  const shoppingLists = use(shoppingListsData);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Inköpslistor</SidebarGroupLabel>

      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <SidebarGroupAction>
            <Plus />
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
              <SidebarMenuButton isActive={pathname.includes(list.id)} asChild>
                <Link href={`/shopping-list/${list.id}`}>
                  <List /> <span>{list.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
