"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, MoreHorizontal, Trash, Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableSearch } from "@/components/data-table-search";
import * as MembershipModel from "@/types/membership";
import { toast } from "sonner";
import { useMemberships } from "@/hooks/use-membership";

export function MembershipTable() {
    const {
        memberships,
        totalMemberships,
        isLoading,
        getMemberships,
        deleteMembership,
        error,
    } = useMemberships();

    // Search and filter state
    const [currentSearchTerm, setCurrentSearchTerm] = useState("");
    const [currentDateRange, setCurrentDateRange] = useState<
        DateRange | undefined
    >(undefined);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Calculate total pages
    const totalPages = Math.ceil(totalMemberships / itemsPerPage);

    // Function to fetch memberships with current filters
    const fetchMemberships = async (params: {
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

        try {
            await getMemberships({
                search: searchTerm,
                fromDate: dateRange?.from
                    ? format(dateRange.from, "yyyy-MM-dd")
                    : undefined,
                toDate: dateRange?.to
                    ? format(dateRange.to, "yyyy-MM-dd")
                    : undefined,
                page,
                pageSize: limit,
            });
            // Update current state
            setCurrentSearchTerm(searchTerm);
            setCurrentDateRange(dateRange);
        } catch (error) {
            console.error("Error fetching memberships:", error);
            toast.error("Failed to fetch memberships");
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
        fetchMemberships({ searchTerm, dateRange, page: 1 });
    };

    const handleDeleteMembership = async (membershipId: string) => {
        try {
            await deleteMembership(membershipId);
            // Refresh the membership list after deletion
            fetchMemberships({});
            toast.success("Membership deleted");
        } catch (error) {
            toast.error("Failed to delete membership");
        }
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        fetchMemberships({ page });
    };

    const handleItemsPerPageChange = (value: string) => {
        const newItemsPerPage = Number.parseInt(value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when items per page changes
        fetchMemberships({ page: 1, limit: newItemsPerPage });
    };

    return (
        <div className="space-y-4">
            <DataTableSearch
                placeholder="Search memberships..."
                onSearch={handleSearch}
                initialSearchTerm={currentSearchTerm}
                initialDateRange={currentDateRange}
            />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price Per Month</TableHead>
                            <TableHead>Price Per Year</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
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
                                            Loading memberships...
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : memberships.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="h-24 text-center"
                                >
                                    No memberships found matching your criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            memberships.map((membership) => (
                                <TableRow key={membership.id}>
                                    <TableCell className="font-medium">
                                        {membership.name}
                                    </TableCell>
                                    <TableCell>
                                        ${membership.pricePerMonth}
                                    </TableCell>
                                    <TableCell>
                                        ${membership.pricePerYear}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                membership.active
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {membership.active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {format(
                                            new Date(membership.createAt),
                                            "MMM d, yyyy"
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
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
                                                        href={`/memberships/${membership.id}`}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() =>
                                                        handleDeleteMembership(
                                                            membership.id.toString()
                                                        )
                                                    }
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination controls */}
            {totalMemberships > 0 && (
                <DataTablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalMemberships}
                    visibleItems={memberships.length}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            )}
        </div>
    );
}
