import NavMain from "@/app/(dashboard)/_components/sidebar/nav-main";
import NavUser from "@/app/(dashboard)/_components/sidebar/nav-user";

import { MiddagsflytIcon } from "@/components/ui/logo/middagsflyt-icon";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <nav>
              <SidebarMenu>
                <NavMain />
              </SidebarMenu>
            </nav>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
