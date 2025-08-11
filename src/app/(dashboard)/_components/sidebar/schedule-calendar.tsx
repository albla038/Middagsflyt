"use client";

import { Calendar } from "@/components/ui/calendar";
import { sv } from "react-day-picker/locale";
import { useState } from "react";

export default function ScheduleCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      locale={sv}
      className="w-full"
      showWeekNumber
    />
  );
}
