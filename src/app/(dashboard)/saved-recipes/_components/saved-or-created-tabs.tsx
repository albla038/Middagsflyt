"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MyRecipesDisplay } from "@/lib/types";
import { use } from "react";

type SavedOrCreatedTabsProps = {
  savedCountPromise: Promise<number>;
  createdCountPromise: Promise<number>;
};

export default function SavedOrCreatedTabs({
  savedCountPromise,
  createdCountPromise,
}: SavedOrCreatedTabsProps) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const savedCount = use(savedCountPromise);
  const createdCount = use(createdCountPromise);

  function handleChange(value: MyRecipesDisplay) {
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
      onValueChange={(value) => handleChange(value as MyRecipesDisplay)}
    >
      <TabsList>
        <TabsTrigger value="saved">
          <span>Sparade</span>
          <Badge variant="outline">{savedCount}</Badge>
        </TabsTrigger>
        <TabsTrigger value="created">
          <span>Importerade/skapade av mig</span>
          <Badge variant="outline">{createdCount}</Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
