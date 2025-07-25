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

export type BreadcrumbItem = { label: string; href?: string };

type HeaderProps = {
  breadcrumbs?: BreadcrumbItem[];
};

export default function Header({ breadcrumbs }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex w-full items-center gap-4 border-b border-border bg-background p-4",
        "transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:gap-2 group-has-data-[collapsible=icon]/sidebar-wrapper:p-2",
      )}
    >
      <SidebarTrigger />
      <span className="h-4 mr-2">
        <Separator orientation="vertical" />
      </span>
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
    </header>
  );
}
