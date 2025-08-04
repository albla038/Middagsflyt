"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SavedOrCreatedTabsProps = {
  savedCount: number;
  createdCount: number;
};

type DisplayType = "saved" | "created";

export default function SavedOrCreatedTabs({
  savedCount,
  createdCount,
}: SavedOrCreatedTabsProps) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(value: DisplayType) {
    const searchParams = new URLSearchParams(params);
    if (value === "created") {
      searchParams.set("display", "created");
    } else {
      searchParams.delete("display");
    }
    router.replace(`${pathname}?${searchParams.toString()}`);
  }

  return (
    <Tabs
      value={params.get("display") === "created" ? "created" : "saved"}
      onValueChange={(value) => handleChange(value as DisplayType)}
    >
      <TabsList>
        <TabsTrigger value="saved">
          <span>Sparade</span>
          <Badge variant="outline">{savedCount}</Badge>
        </TabsTrigger>
        <TabsTrigger value="created">
          <span>Importerade/skapade</span>
          <Badge variant="outline">{createdCount}</Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
