"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { DataTablePagination } from "../ui/data-table-pagination";
import { DataTableSearch } from "../data-table-search";
import { useUsers } from "@/hooks/use-users";

export function UserTable() {
    const { users, totalUsers, isLoading, getUsers, formatDateRange } =
        useUsers();

    // Search and filter state
    const [currentSearchTerm, setCurrentSearchTerm] = useState("");
    const [currentDateRange, setCurrentDateRange] = useState<
        DateRange | undefined
    >(undefined);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / itemsPerPage);

    // Function to fetch users with current filters
    const fetchUsers = async (params: {
        searchTerm?: string;
        dateRange?: DateRange;
        page?: number;
        limit?: number;
    }) => {
        const {
            searchTerm = currentSearchTerm,
            dateRange = currentDateRange,
            page = currentPage,
            limit = itemsPerPage,
        } = params;
        // Format date range for API
        const { startDate, endDate } = formatDateRange(dateRange);
        try {
            await getUsers({
                search: searchTerm,
                fromDate: startDate,
                toDate: endDate,
                page,
                pageSize: limit,
            });
            // Update current state
            setCurrentSearchTerm(searchTerm);
            setCurrentDateRange(dateRange);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast("Error", {
                description: "Failed to fetch users",
            });
        }
    };

    const handleSearch = ({
        searchTerm,
        dateRange,
    }: {
        searchTerm: string;
        dateRange: DateRange | undefined;
    }) => {
        setCurrentPage(1); // Reset to first page when search changes
        fetchUsers({ searchTerm, dateRange, page: 1 });
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        fetchUsers({ page });
    };

    const handleItemsPerPageChange = (value: string) => {
        const newItemsPerPage = Number.parseInt(value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when items per page changes
        fetchUsers({ page: 1, limit: newItemsPerPage });
    };

    return (
        <div className="space-y-4">
            <DataTableSearch
                placeholder="Search users..."
                onSearch={handleSearch}
                initialSearchTerm={currentSearchTerm}
                initialDateRange={currentDateRange}
            />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            {/* <TableHead className="text-right">
                                Actions
                            </TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="h-24 text-center"
                                >
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        <span className="ml-2">
                                            Loading users...
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="h-24 text-center"
                                >
                                    No users found matching your criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.name}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.status === 1
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {format(
                                            new Date(user.createAt),
                                            "MMM d, yyyy"
                                        )}
                                    </TableCell>
                                    {/* <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <span className="sr-only">
                                                        Open menu
                                                    </span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                    Actions
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/users/${user.id}`}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() =>
                                                        handleDeleteUser(
                                                            user.id
                                                        )
                                                    }
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell> */}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination controls */}
            {totalUsers > 0 && (
                <DataTablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalUsers}
                    visibleItems={users.length}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            )}
        </div>
    );
}
