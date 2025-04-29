"use client";

import Link from "next/link";
import { Loader2, MoreHorizontal, View } from "lucide-react";

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
import { DataTableSearch } from "../data-table-search";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import { useCompany } from "@/hooks/use-company";
import { toast } from "sonner";
import { DataTablePagination } from "../ui/data-table-pagination";

export function CompanyTable() {
    const {
        companies,
        totalCompanies,
        isLoading,
        getCompanies,
        formatDateRange,
    } = useCompany();
    // Search and filter state
    const [currentSearchTerm, setCurrentSearchTerm] = useState("");
    const [currentDateRange, setCurrentDateRange] = useState<
        DateRange | undefined
    >(undefined);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Calculate total pages
    const totalPages = Math.ceil(totalCompanies / itemsPerPage);

    // Function to fetch users with current filters
    const fetchCompanies = async (params: {
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
            await getCompanies({
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
            console.error("Error fetching companies:", error);
            toast("Error", {
                description: "Failed to fetch companies",
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
        fetchCompanies({ searchTerm, dateRange, page: 1 });
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        fetchCompanies({ page });
    };

    const handleItemsPerPageChange = (value: string) => {
        const newItemsPerPage = Number.parseInt(value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when items per page changes
        fetchCompanies({ page: 1, limit: newItemsPerPage });
    };

    return (
        <div className="space-y-4">
            <DataTableSearch
                placeholder="Search companies..."
                onSearch={handleSearch}
                initialSearchTerm={currentSearchTerm}
                initialDateRange={currentDateRange}
            />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Website</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead>Zip Code</TableHead>
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
                                            Loading Companies...
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : companies.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center"
                                >
                                    No companies found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            companies.map((company) => (
                                <TableRow key={company.id}>
                                    <TableCell className="font-medium">
                                        {company.name}
                                    </TableCell>
                                    <TableCell>{company.description}</TableCell>
                                    <TableCell>{company.phone}</TableCell>
                                    <TableCell>{company.email}</TableCell>
                                    <TableCell>{company.website}</TableCell>
                                    <TableCell>{company.street1}</TableCell>
                                    <TableCell>{company.city}</TableCell>
                                    <TableCell>{company.state}</TableCell>
                                    <TableCell>{company.zipCode}</TableCell>
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
                                                        href={`/companies/${company.id}`}
                                                    >
                                                        <View className="mr-2 h-4 w-4" />
                                                        View details
                                                    </Link>
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
            {totalCompanies > 0 && (
                <DataTablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalCompanies}
                    visibleItems={companies.length}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            )}
        </div>
    );
}
