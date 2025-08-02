"use client";

import { Input } from "@/components/ui/input";
import { ComponentPropsWithoutRef } from "react";

type SearhBarProps = ComponentPropsWithoutRef<"input">;

export default function SearchBar({ ...rest }: SearhBarProps) {
  return <Input {...rest} type="search"></Input>;
}
