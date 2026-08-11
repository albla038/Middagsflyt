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
      const scheduleId = Array.isArray(params.slug)
        ? params.slug?.at(0)
        : params.slug;
      const year = getISOWeekYear(date);
      const week = getISOWeek(date);

      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("date", format(date, "yyyy-MM-dd"));

      if (pathname.includes(`/schedule/${scheduleId}/create`)) {
        // If user is on a create page, stay there but update the date
        router.replace(`${pathname}?${newSearchParams.toString()}`);
      } else if (pathname.includes(`/schedule/${scheduleId}`)) {
        // If user is on a schedule page, update the week and date
        router.replace(
          `/schedule/${scheduleId}/${year}/${week}?${newSearchParams.toString()}`,
        );
      } else {
        // Else, if the user is on a different page, just update the date query parameter
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
