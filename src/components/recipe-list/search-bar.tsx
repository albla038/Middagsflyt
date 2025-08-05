"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ComponentPropsWithoutRef } from "react";
import { useDebouncedCallback } from "use-debounce";

type SearhBarProps = ComponentPropsWithoutRef<"input">;

export default function SearchBar({ ...rest }: SearhBarProps) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleInput = useDebouncedCallback((key: string, input: string) => {
    const searchParams = new URLSearchParams(params);
    if (input) {
      searchParams.set(key, input);
    } else {
      searchParams.delete(key);
    }

    router.replace(`${pathname}/?${searchParams.toString()}`);
  }, 200);

  return (
    <Input
      {...rest}
      type="text"
      defaultValue={params.get("query")?.toString()}
      onChange={(event) => handleInput("query", event.target.value)}
      className="max-w-md"
    />
  );
}
