"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTablePaginationProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    visibleItems: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (value: string) => void;
}

export function DataTablePagination({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    visibleItems,
    onPageChange,
    onItemsPerPageChange,
}: DataTablePaginationProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                    Showing {visibleItems} of {totalItems} items
                </p>
                <div className="flex items-center gap-1">
                    <p className="text-sm text-muted-foreground">
                        Items per page
                    </p>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={onItemsPerPageChange}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue
                                placeholder={itemsPerPage.toString()}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                </Button>
                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        // Show pages around current page
                        let pageNum = i + 1;
                        if (totalPages > 5) {
                            if (currentPage > 3) {
                                pageNum = currentPage - 3 + i;
                            }
                            if (
                                pageNum > totalPages - 4 &&
                                currentPage > totalPages - 2
                            ) {
                                pageNum = totalPages - 4 + i;
                            }
                        }
                        if (pageNum <= totalPages) {
                            return (
                                <Button
                                    key={pageNum}
                                    variant={
                                        currentPage === pageNum
                                            ? "default"
                                            : "outline"
                                    }
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => onPageChange(pageNum)}
                                >
                                    {pageNum}
                                </Button>
                            );
                        }
                        return null;
                    })}
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                </Button>
            </div>
        </div>
    );
}
