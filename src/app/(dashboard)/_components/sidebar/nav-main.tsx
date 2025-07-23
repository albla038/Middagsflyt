"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { CalendarFold, ChefHat, Database, List } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Kalender",
    href: "/schedule",
    icon: CalendarFold,
  },
  {
    title: "Mina recept",
    href: "/my-recipes",
    icon: ChefHat,
  },
  {
    title: "Receptbibliotek",
    href: "/library",
    icon: Database,
  },
  {
    title: "Inköpslistor",
    href: "/shopping-lists",
    icon: List,
  },
];

export default function NavMain() {
  const pathName = usePathname();

  return (
    <>
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
    </>
  );
}
