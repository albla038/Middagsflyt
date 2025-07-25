import AppSidebar from "@/app/(dashboard)/_components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="w-full">{children}</div>
      </div>
    </SidebarProvider>
  );
}
