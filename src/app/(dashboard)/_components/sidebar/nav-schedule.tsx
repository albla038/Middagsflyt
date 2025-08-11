"use client";

import ScheduleCalendar from "@/app/(dashboard)/_components/sidebar/schedule-calendar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { cn } from "@/lib/utils";
import { CalendarFold, ChevronRight, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const pagePath = "/schedule";

export default function NavSchedule() {
  const pathname = usePathname();
  const [open, setOpen] = useState(pathname.includes(pagePath));

  return (
    <Collapsible
      className="group/collapsible"
      open={open}
      onOpenChange={setOpen}
    >
      <SidebarGroup>
        <SidebarGroupLabel className="relative">
          <CollapsibleTrigger className="w-full text-left">
            Kalender
          </CollapsibleTrigger>
          <div
            className={cn(
              "absolute right-6 hidden text-foreground",
              "group-data-[state=open]/collapsible:flex",
              "group-hover/collapsible:flex",
            )}
          >
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                {/* // TODO Add action */}
                <Button variant="ghost" size="icon" className="size-5">
                  <Plus />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Ny kalender</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </SidebarGroupLabel>
        <CollapsibleTrigger asChild>
          <SidebarGroupAction>
            <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarGroupAction>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                // isActive={pathname.includes(Item.id)}
                >
                  <CalendarFold />
                  <span>Min kalender</span>
                </SidebarMenuButton>

                <SidebarMenuButton
                // isActive={pathname.includes(Item.id)}
                >
                  <CalendarFold />
                  <span>Hem</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <div className="mt-4">
              <ScheduleCalendar />
            </div>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
