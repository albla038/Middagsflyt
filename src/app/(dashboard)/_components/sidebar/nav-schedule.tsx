"use client";

import ScheduleCalendar from "@/app/(dashboard)/_components/sidebar/schedule-calendar";
import SaveScheduleDialog, {
  DialogState,
} from "@/app/(dashboard)/_components/sidebar/save-schedule-dialog";
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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Schedule } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import {
  CalendarFold,
  ChevronRight,
  Edit,
  MoreHorizontal,
  Plus,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const pagePath = "/schedule";

type NavScheduleProps = {
  scheduleData: Promise<Schedule[]>;
};

export default function NavSchedule({ scheduleData }: NavScheduleProps) {
  const pathname = usePathname();

  // State to manage the collapsible open state
  const [collapsibleOpen, setCollapsibleOpen] = useState(
    pathname.includes(pagePath),
  );

  // State to manage the dialog
  const [dialogState, setDialogState] = useState<DialogState>({
    mode: "CLOSED",
  });

  const schedules = use(scheduleData);

  return (
    <>
      <Collapsible
        className="group/collapsible"
        open={collapsibleOpen}
        onOpenChange={setCollapsibleOpen}
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
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5"
                    onClick={() => setDialogState({ mode: "CREATE" })}
                  >
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

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent side="right" align="start">
                        {/* Edit name action */}
                        <DropdownMenuItem
                          onSelect={() =>
                            setDialogState({ mode: "EDIT", schedule })
                          }
                        >
                          <Edit />
                          <span>Byt namn</span>
                        </DropdownMenuItem>

                        {/* Delete schedule action */}
                        <DropdownMenuItem>
                          <Trash2Icon className="text-destructive" />
                          <span>Ta bort kalender</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      <SaveScheduleDialog
        dialogState={dialogState}
        setDialogState={setDialogState}
      />
    </>
  );
}
