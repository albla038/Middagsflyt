"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { SORT_BY_OPTIONS, SortBy } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import z from "zod";

const sortSchema = z.enum(SORT_BY_OPTIONS).catch("createdAt");

export default function SortSelect() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentSort = sortSchema.parse(params.get("sort"));

  function handleChange(value: SortBy) {
    const searchParams = new URLSearchParams(params);
    if (value === "createdAt") {
      searchParams.delete("sort");
    } else {
      searchParams.set("sort", value);
    }
    router.replace(`${pathname}?${searchParams.toString()}`);
  }

  return (
    <Select
      value={currentSort}
      onValueChange={(value) => handleChange(value as SortBy)}
    >
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Sortering" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sortering</SelectLabel>
          <SelectItem value="createdAt">Tillagt datum</SelectItem>
          <SelectItem value="name">Namn</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
