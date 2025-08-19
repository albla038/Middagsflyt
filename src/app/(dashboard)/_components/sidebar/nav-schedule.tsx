"use client";

import ScheduleCalendar from "@/app/(dashboard)/_components/sidebar/schedule-calendar";
import SaveScheduleDialog, {
  SaveDialogState,
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
import { usePathname, useSearchParams } from "next/navigation";
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
import DeleteScheduleAlert, {
  DeleteAlertState,
} from "@/app/(dashboard)/_components/sidebar/delete-schedule-alert";
import { getISOWeek, getISOWeekYear, parse } from "date-fns";

const pagePath = "/schedule";

type NavScheduleProps = {
  scheduleData: Promise<Schedule[]>;
};

export default function NavSchedule({ scheduleData }: NavScheduleProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State to manage the collapsible open state
  const [collapsibleOpen, setCollapsibleOpen] = useState(
    pathname.includes(pagePath),
  );

  // State to manage the dialogs
  const [saveDialogState, setSaveDialogState] = useState<SaveDialogState>({
    mode: "CLOSED",
  });
  const [deleteAlertState, setDeleteAlertState] = useState<DeleteAlertState>({
    mode: "CLOSED",
  });

  const schedules = use(scheduleData);

  let year: number | undefined;
  let week: number | undefined;
  const selectedDate = searchParams.get("date");
  if (selectedDate) {
    const date = parse(selectedDate, "yyyy-MM-dd", new Date());
    year = getISOWeekYear(date);
    week = getISOWeek(date);
  }

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
                    onClick={() => setSaveDialogState({ mode: "CREATE" })}
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
                      <Link
                        href={
                          year && week
                            ? `/schedule/${schedule.id}/${year}/${week}?${searchParams.toString()}`
                            : `/schedule/${schedule.id}?${searchParams.toString()}`
                        }
                      >
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
                            setTimeout(
                              () =>
                                setSaveDialogState({ mode: "EDIT", schedule }),
                              0,
                            )
                          }
                        >
                          <Edit />
                          <span>Byt namn</span>
                        </DropdownMenuItem>

                        {/* Delete schedule action */}
                        <DropdownMenuItem
                          onSelect={() =>
                            setTimeout(
                              () =>
                                setDeleteAlertState({ mode: "OPEN", schedule }),
                              0,
                            )
                          }
                        >
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
        dialogState={saveDialogState}
        setDialogState={setSaveDialogState}
      />

      <DeleteScheduleAlert
        alertState={deleteAlertState}
        setAlertState={setDeleteAlertState}
      />
    </>
  );
}
