"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Calendar, CalendarFold, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const pagePath = "/schedule";

export default function NavSchedule() {
  const pathname = usePathname();
  const [open, setOpen] = useState(pathname.includes(pagePath));

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <Collapsible
            className="group/collapsible"
            open={open}
            onOpenChange={setOpen}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.includes(pagePath)}
                onClick={() => setOpen(true)}
              >
                <Link href={pagePath}>
                  <CalendarFold />
                  <span>Kalender</span>
                </Link>
              </SidebarMenuButton>

              <CollapsibleTrigger asChild>
                <SidebarMenuAction>
                  <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuAction>
              </CollapsibleTrigger>

              <CollapsibleContent className="grid gap-2">
                <SidebarMenuSub>
                  {/*  // TODO Replace with real data */}
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton>
                      <Calendar />
                      <span>Min kalender</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  {/* // TODO Add action */}
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton>
                      <Plus />
                      <span>Ny kalender</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
                <div className="h-[500px] w-full bg-accent"></div>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
