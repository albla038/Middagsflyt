import AppSidebar from "@/app/(dashboard)/_components/sidebar/app-sidebar";
import RecipeSelection from "@/app/(dashboard)/schedule/[...id]/selection-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <RecipeSelection>
        <div className="flex h-svh w-full">
          <AppSidebar />
          <div className="h-full w-full">{children}</div>
        </div>
      </RecipeSelection>
    </SidebarProvider>
  );
}
