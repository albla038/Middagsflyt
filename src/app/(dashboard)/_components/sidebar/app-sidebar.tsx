import NavSchedule from "@/app/(dashboard)/_components/sidebar/nav-schedule";
import NavRecipes from "@/app/(dashboard)/_components/sidebar/nav-recipes";
import NavShoppingLists from "@/app/(dashboard)/_components/sidebar/nav-shopping-lists";
import NavUser from "@/app/(dashboard)/_components/sidebar/nav-user";

import { MiddagsflytIcon } from "@/components/ui/logo/middagsflyt-icon";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/my-recipes">
                <div className="flex items-center gap-3">
                  <MiddagsflytIcon className="size-8 rounded-sm bg-sidebar-primary p-1 text-sidebar-primary-foreground" />
                  <span className="text-xl font-medium">Middagsflyt</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <ScrollArea className="flex min-h-0 flex-1 flex-col">
        <SidebarContent>
          <NavSchedule />
          <NavRecipes />
          <NavShoppingLists />
        </SidebarContent>
      </ScrollArea>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
