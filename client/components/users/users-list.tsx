"use client";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableCaption,
} from "@/components/ui/table";
import React from "react";
import { toast } from "sonner";
import { RotateCcw, Filter, MoreHorizontal, Users, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useUsers } from "@/hooks/use-users";
import { DeleteUsers } from "./delete-users";
import { Button } from "@/components/ui/button";
import { UserDetailDialog } from "./users-detail";
import { NewUsersForm } from "./new-users-form";
import { EditUserForm } from "./update-users-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";

export const UsersList = () => {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [role, setRole] = React.useState<"ADMIN" | "EMPLOYEE" | undefined>(
    undefined
  );

  const debouncedSearch = useDebounce(search, 500);

  const { data, isFetching, refetch } = useUsers({
    page,
    limit,
    search: debouncedSearch,
  });

  const users = data?.data?.users ?? [];
  const meta = data?.data?.pagination ?? {
    page,
    limit,
    totalUsers: 0,
    totalPages: 1,
  };

  const handleResetFilter = () => {
    setSearch("");
    setRole(undefined);
    setPage(1);
  };

  const handlePageChange = (p: number) => setPage(p);

  const handleSearchInput = (q: string) => {
    setSearch(q);
    setPage(1);
  };

  const handleRefetch = () => {
    refetch();
    toast.success("Users refreshed successfully");
  };

  const isFiltered = search !== "" || role !== undefined;
  const isEmpty = !isFiltered && meta.totalUsers === 0;

  console.log(users);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between py-6 border-b">
        <div className="space-y-2">
          <h1 className="flex items-center gap-2">
            <Users className="h-8 w-8" />
            User Management
          </h1>
          <p>Manage application users and their profiles</p>
        </div>

        <NewUsersForm />
      </div>

      <div className="border rounded-md">
        {isEmpty && !isFetching ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="text-lg font-semibold text-muted-foreground">
              No Users Available
            </span>
          </div>
        ) : (
          <>
            {/* Feature Bar */}
            <div className="py-4 px-2 flex items-center justify-between">
              <SearchInput
                q={search}
                onChange={handleSearchInput}
                placeholder="Search by email"
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
                {meta.totalUsers ? (
                  <Pagination
                    page={meta.currentPage}
                    limit={meta.limit}
                    total={meta.totalUsers}
                    onPageChange={handlePageChange}
                  />
                ) : null}
              </TableCaption>
              <TableHeader className="border-t">
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border-b">
                {isFetching ? (
                  Array.from({ length: limit }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell colSpan={7}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : users.length > 0 ? (
                  users.map((user: any) => (
                    <TableRow key={user.id} className="h-12">
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <span className="text-green-600 font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{user.profile?.fullName ?? "-"}</TableCell>
                      <TableCell>{user.profile?.department ?? "-"}</TableCell>
                      <TableCell>{user.profile?.position ?? "-"}</TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <UserDetailDialog user={user} />
                            <DropdownMenuItem asChild>
                              <EditUserForm user={user} />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.canDelete ? (
                              <DeleteUsers
                                userId={user.id}
                                email={user.email}
                              />
                            ) : (
                              <DropdownMenuItem disabled>
                                <Trash2 className="w-4 h-4 mr-2 opacity-50" />
                                Delete (not allowed)
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24">
                      <div className="flex flex-col items-center justify-center py-16">
                        <span className="text-lg font-semibold text-muted-foreground mb-2">
                          No Users Found
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
