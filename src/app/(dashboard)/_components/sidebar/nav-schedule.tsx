"use client";

import ScheduleCalendar from "@/app/(dashboard)/_components/sidebar/schedule-calendar";
import SaveScheduleDialog from "@/app/(dashboard)/_components/sidebar/save-name-dialog";
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
import { Schedule } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { CalendarFold, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use, useState } from "react";

const pagePath = "/schedule";

type NavScheduleProps = {
  scheduleData: Promise<Schedule[]>;
};

export default function NavSchedule({ scheduleData }: NavScheduleProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(pathname.includes(pagePath));

  const schedules = use(scheduleData);

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
              "absolute right-6 text-foreground opacity-0",
              "group-data-[state=open]/collapsible:opacity-100",
              "group-hover/collapsible:opacity-100",
            )}
          >
            <SaveScheduleDialog mode="create" />
          </div>
        </SidebarGroupLabel>
        <CollapsibleTrigger asChild>
          <SidebarGroupAction>
            <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarGroupAction>
        </CollapsibleTrigger>

        {/* Main Content */}
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {schedules.map((schedule) => (
                <SidebarMenuItem key={schedule.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.includes(schedule.id)}
                  >
                    <Link href={`/schedule/${schedule.id}`}>
                      <CalendarFold />
                      <span>{schedule.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            {/* Schedule calendar */}
            <div className="mt-4">
              <ScheduleCalendar />
            </div>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
