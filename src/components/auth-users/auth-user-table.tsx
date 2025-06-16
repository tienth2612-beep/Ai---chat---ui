"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search } from "lucide-react";
import { useAuthUser } from "@/hooks/use-auth-user";
import { formatDate } from "@/lib/utils";
import { DataTablePagination } from "../ui/data-table-pagination";
import { DateRange } from "react-day-picker";
import { DataTableSearch } from "../data-table-search";
export function AuthUserTable() {
    const router = useRouter();
    const {
        users,
        totalUsers,
        isLoading,
        error,
        getAllUsers,
        toggleAuthUserStatus,
    } = useAuthUser();

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentSearchTerm, setCurrentSearchTerm] = useState("");
    const [currentDateRange, setCurrentDateRange] = useState<
        DateRange | undefined
    >(undefined);

    useEffect(() => {
        getAllUsers({
            page: currentPage,
            pageSize: itemsPerPage,
            search: searchQuery,
        });
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value: string) => {
        const newItemsPerPage = Number.parseInt(value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleStatusToggle = async (id: number, currentStatus: number) => {
        try {
            await toggleAuthUserStatus(id, {
                status: currentStatus === 1 ? 0 : 1,
            });
            getAllUsers({
                page: currentPage,
                pageSize: itemsPerPage,
                search: searchQuery,
            });
        } catch (error) {
            console.error("Failed to toggle user status:", error);
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
        getAllUsers({ search: searchTerm, page: 1 });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

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
                            <TableHead>Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.address}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            user.status === 1
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {user.status === 1
                                            ? "Active"
                                            : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {formatDate(user.createAt)}
                                </TableCell>
                                <TableCell>
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
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    router.push(
                                                        `/settings/auth-users/${user.id}`
                                                    )
                                                }
                                            >
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    router.push(
                                                        `/settings/auth-users/${user.id}/edit`
                                                    )
                                                }
                                            >
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleStatusToggle(
                                                        user.id,
                                                        user.status
                                                    )
                                                }
                                            >
                                                {user.status === 1
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {totalUsers > itemsPerPage && (
                <DataTablePagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalUsers / itemsPerPage)}
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
