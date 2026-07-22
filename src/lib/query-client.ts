import { BetterFetchError } from "@better-fetch/fetch";
import { isServer, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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

// Return a user-friendly error message for React Query errors, (based on BetterFetchError status codes)
function getDefaultErrorMessage(error: Error): string {
  if (error instanceof BetterFetchError) {
    const status = error.status;

    switch (status) {
      case 400:
        return "Något gick fel. Kontrollera dina uppgifter och försök igen.";
      case 401:
        return "Din session har gått ut. Vänligen logga in igen.";
      case 403:
        return "Du har inte behörighet att utföra den här åtgärden.";
      case 404:
        return "Vi kunde inte hitta det du letade efter.";
      case 408:
        return "Det tog för lång tid att svara. Kontrollera din internetanslutning och försök igen.";
      case 500:
        return "Våra servrar har problem just nu. Försök igen senare.";
      case 503:
        return "Tjänsten är för tillfället inte tillgänglig. Vi jobbar på det!";
    }
  }

  return "Ett oväntat fel inträffade. Försök igen senare.";
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
          query.meta?.errorMessage ?? getDefaultErrorMessage(error);

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
