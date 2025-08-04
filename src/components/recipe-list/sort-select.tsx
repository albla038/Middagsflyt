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
import { SortBy } from "@/data/recipe/queries";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortSelect() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(value: SortBy) {
    const searchParams = new URLSearchParams(params);
    searchParams.set("sort", value);
    router.replace(`${pathname}?${searchParams.toString()}`);
  }

  return (
    <Select
      defaultValue="createdAt"
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
