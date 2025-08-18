"use client";

import { Calendar } from "@/components/ui/calendar";
import { sv } from "react-day-picker/locale";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { format, getISOWeek, getISOWeekYear, parse } from "date-fns";

export default function ScheduleCalendar() {
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedDateRaw = searchParams.get("date");
  const date = selectedDateRaw
    ? parse(selectedDateRaw, "yyyy-MM-dd", new Date())
    : new Date();

  function handleSelect(date: Date | undefined) {
    if (date) {
      const scheduleId = params.id?.at(0);
      const year = getISOWeekYear(date);
      const week = getISOWeek(date);

      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("date", format(date, "yyyy-MM-dd"));
      if (pathname.includes(`/schedule/${scheduleId}`)) {
        router.replace(
          `/schedule/${scheduleId}/${year}/${week}?${newSearchParams.toString()}`,
        );
      } else {
        router.replace(`${pathname}/?${newSearchParams.toString()}`);
      }
    }
  }

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleSelect}
      locale={sv}
      className="w-full"
      showWeekNumber
    />
  );
}
