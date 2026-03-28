import { apiClient } from "@/components/add-to-shopping-list/queries/api-client";
import { useQuery } from "@tanstack/react-query";

export default function useAllShoppingLists(open: boolean) {
  return useQuery({
    queryKey: ["all-shopping-lists"],
    queryFn: () => apiClient("/api/shopping-lists"),
    enabled: open, // Only fetch when dialog is open
  });
}
