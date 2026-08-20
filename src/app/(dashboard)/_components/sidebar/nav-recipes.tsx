"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Bookmark, ChefHat, Database } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Mina recept",
    href: "/my-recipes",
    icon: ChefHat,
  },
  {
    title: "Sparade recept",
    href: "/saved-recipes",
    icon: Bookmark,
  },
  {
    title: "Receptbibliotek",
    href: "/library",
    icon: Database,
  },
];

export default function NavRecipes() {
  const pathName = usePathname();

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={pathName.includes(item.href)}>
            <Link href={item.href}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
