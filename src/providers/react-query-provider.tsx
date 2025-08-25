"use client";

import { getQueryClient } from "@/lib/query-client";
import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

export default function ReactQueryProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
