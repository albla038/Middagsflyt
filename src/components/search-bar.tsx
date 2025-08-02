"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ComponentPropsWithoutRef, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";

type SearhBarProps = ComponentPropsWithoutRef<"input">;

export default function SearchBar({ ...rest }: SearhBarProps) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useMemo(() => new URLSearchParams(params), [params]);

  const handleInput = useDebouncedCallback((key: string, input: string) => {
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
      defaultValue={searchParams.get("query")?.toString()}
      onChange={(event) => handleInput("query", event.target.value)}
    ></Input>
  );
}
