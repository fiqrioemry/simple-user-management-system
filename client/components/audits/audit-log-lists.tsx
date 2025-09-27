"use client";

import React from "react";
import { toast } from "sonner";
import { Eye, RotateCcw, ListChecks, Filter } from "lucide-react";
import { useAuditLogs } from "@/hooks/use-audit";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableCaption,
} from "@/components/ui/table";

export const AuditLogLists = () => {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isFetching, refetch } = useAuditLogs({
    page,
    limit,
    search: debouncedSearch,
  });

  const logs = data?.data?.auditLogs ?? [];
  const meta = data?.data?.pagination ?? {
    page,
    limit,
    totalRecords: 0,
    totalPages: 1,
  };

  // Handlers
  const handleResetFilter = () => {
    setSearch("");
    setPage(1);
  };

  const handlePageChange = (p: number) => setPage(p);

  const handleSearchInput = (q: string) => {
    setSearch(q);
    setPage(1);
  };

  const handleRefetch = () => {
    refetch();
    toast.success("Audit logs refreshed");
  };

  const isFiltered = search !== "";
  const isEmpty = !isFiltered && meta.totalRecords === 0;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between py-6 border-b">
        <div className="space-y-2">
          <h1 className="flex items-center gap-2">
            <ListChecks className="h-8 w-8" />
            Audit Logs
          </h1>
          <p>Track user actions and system activities</p>
        </div>
      </div>

      <div className="border rounded-md">
        {isEmpty && !isFetching ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="text-lg font-semibold text-muted-foreground">
              No Audit Logs Available
            </span>
          </div>
        ) : (
          <>
            {/* Feature Bar */}
            <div className="py-4 px-2 flex items-center justify-between">
              <SearchInput
                q={search}
                onChange={handleSearchInput}
                placeholder="Search by action, entity, email..."
              />

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefetch}
                  title="Refresh"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableCaption className="mt-1">
                {meta.totalRecords ? (
                  <Pagination
                    page={meta.currentPage}
                    limit={meta.limit}
                    total={meta.totalRecords}
                    onPageChange={handlePageChange}
                  />
                ) : null}
              </TableCaption>
              <TableHeader className="border-t">
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Metadata</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border-b">
                {isFetching ? (
                  Array.from({ length: limit }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell colSpan={6}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : logs.length > 0 ? (
                  logs.map((log: any) => (
                    <TableRow key={log.id} className="h-12">
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.entity}</TableCell>
                      <TableCell>
                        {log.user
                          ? `${log.user.fullName ?? "-"} (${log.user.email})`
                          : "System"}
                      </TableCell>
                      <TableCell>{log.ipAddress ?? "-"}</TableCell>
                      <TableCell>
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>

                      {/* Eye Button -> Dialog */}
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Audit Metadata</DialogTitle>
                            </DialogHeader>
                            <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24">
                      <div className="flex flex-col items-center justify-center py-16">
                        <span className="text-lg font-semibold text-muted-foreground mb-2">
                          No Audit Logs Found
                        </span>
                        <Button onClick={handleResetFilter}>
                          <Filter className="mr-1" />
                          Reset Filter
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </>
  );
};
