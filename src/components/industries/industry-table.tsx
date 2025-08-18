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
import { useIndustry } from "@/hooks/use-industry";
import { formatDate } from "@/lib/utils";
import { DataTablePagination } from "../ui/data-table-pagination";
import { DataTableSearch } from "../data-table-search";
import { DateRange } from "react-day-picker";

export function IndustryTable() {
    const router = useRouter();
    const {
        industries,
        totalIndustries,
        isLoading,
        error,
        getIndustries,
        toggleIndustryStatus,
    } = useIndustry();

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentSearchTerm, setCurrentSearchTerm] = useState("");
    const [currentDateRange, setCurrentDateRange] = useState<
        DateRange | undefined
    >(undefined);

    useEffect(() => {
        getIndustries({
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
            await toggleIndustryStatus(id.toString(), {
                status: currentStatus === 1 ? 0 : 1,
            });
            getIndustries({
                page: currentPage,
                pageSize: itemsPerPage,
                search: searchQuery,
            });
        } catch (error) {
            console.error("Failed to toggle industry status:", error);
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
        getIndustries({ search: searchTerm, page: 1 });
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
                placeholder="Search industries..."
                onSearch={handleSearch}
                initialSearchTerm={currentSearchTerm}
                initialDateRange={currentDateRange}
            />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {industries.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="h-24 text-center"
                                >
                                    No industries found matching your criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            industries.map((industry) => (
                                <TableRow key={industry.id}>
                                    <TableCell>{industry.name}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                industry.status === 1
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {industry.status === 1
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(industry.createAt)}
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
                                                            `/settings/industries/${industry.id}`
                                                        )
                                                    }
                                                >
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        router.push(
                                                            `/settings/industries/${industry.id}/edit`
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleStatusToggle(
                                                            industry.id,
                                                            industry.status
                                                        )
                                                    }
                                                >
                                                    {industry.status === 1
                                                        ? "Deactivate"
                                                        : "Activate"}
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

            {totalIndustries > itemsPerPage && (
                <DataTablePagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalIndustries / itemsPerPage)}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalIndustries}
                    visibleItems={industries.length}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            )}
        </div>
    );
}
