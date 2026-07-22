import { isServer, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getDefaultQueryErrorMessage } from "@/lib/error-messages";
import "@tanstack/react-query";

// Type the `meta` object inside useQuery() and QueryCache by extending the default TanStack Query types
declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: {
      errorMessage?: string;
      showToast?: boolean;
    };
  }
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      // With SSR, set staleTime above 0 to avoid refetching immediately on the client
      queries: {
        staleTime: 60 * 1000,
      },
    },

    queryCache: new QueryCache({
      onError: (error, query) => {
        if (isServer) return;

        // Allow query hooks to opt-out of global error toasts
        if (query.meta?.showToast === false) return;

        // Allow query hooks to override the default error messages
        const errorMessage =
          query.meta?.errorMessage ?? getDefaultQueryErrorMessage(error);

        toast.error(errorMessage);
      },
    }),
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
