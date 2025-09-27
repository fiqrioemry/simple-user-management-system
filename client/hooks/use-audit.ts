"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuditLogs, AuditLogsParams } from "@/lib/api/audit";

export function useAuditLogs(params: AuditLogsParams) {
  return useQuery({
    queryKey: ["auditLogs", params],
    queryFn: () => getAuditLogs(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
