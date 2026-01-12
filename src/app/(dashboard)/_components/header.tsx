import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Slash } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export type BreadcrumbItem = { label: string; href?: string };

type HeaderProps = {
  children?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
};

export default function Header({ children, breadcrumbs }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-border bg-background transition-[width,height] ease-linear">
      <div
        className={cn(
          "flex w-full items-center gap-2 p-2",
          "md:gap-4 md:p-4",
          "group-has-data-[collapsible=icon]/sidebar-wrapper:gap-2 group-has-data-[collapsible=icon]/sidebar-wrapper:p-2",
        )}
      >
        <SidebarTrigger />
        <span className="mr-2 h-4">
          <Separator orientation="vertical" />
        </span>

        <div className="flex grow items-center gap-2">
          {breadcrumbs && (
            <nav aria-label="Breadcrumbs">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap items-center gap-1.5 sm:gap-2.5"
                    >
                      {index < breadcrumbs.length - 1 ? (
                        <>
                          <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                              <Link href={breadcrumb.href ?? "/"}>
                                {breadcrumb.label}
                              </Link>
                            </BreadcrumbLink>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator>
                            <Slash />
                          </BreadcrumbSeparator>
                        </>
                      ) : (
                        <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                      )}
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </nav>
          )}
          {children}
        </div>
      </div>
    </header>
  );
}
