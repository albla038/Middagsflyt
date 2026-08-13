import { apiClient } from "@/queries/api-client";
import { queryOptions } from "@tanstack/react-query";

export function schedulesQueryOptions() {
  return queryOptions({
    queryKey: ["schedules"],
    queryFn: () => apiClient("/api/schedules"),
  });
}
