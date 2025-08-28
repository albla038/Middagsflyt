import AppSidebar from "@/app/(dashboard)/_components/sidebar/app-sidebar";
import RecipeSelection from "@/app/(dashboard)/schedule/[...id]/selection-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function ScheduleLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-svh w-full">
        <AppSidebar />
        <RecipeSelection>
          <div className="w-full">{children}</div>
        </RecipeSelection>
      </div>
    </SidebarProvider>
  );
}
