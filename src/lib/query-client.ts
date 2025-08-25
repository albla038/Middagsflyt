import { isServer, QueryClient } from "@tanstack/react-query";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      // With SSR, set staleTime above 0 to avoid refetching immediately on the client
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return createQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = createQueryClient();
    return browserQueryClient;
  }
}
