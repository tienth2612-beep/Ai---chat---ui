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
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Info, MoreHorizontal } from "lucide-react";
import { useCommonQuestions } from "@/hooks/use-common-questions";
import { format } from "date-fns";
import { COMMON_QUESTION_TYPE } from "@/lib/constants";
import { DataTableSearch } from "../data-table-search";
import { DataTablePagination } from "../ui/data-table-pagination";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { CommonQuestionForm } from "@/components/common-questions/common-question-form";

export interface CommonQuestionTableProps {
    groupId: number;
}

export function CommonQuestionTable({ groupId }: CommonQuestionTableProps) {
    const router = useRouter();
    const {
        questions,
        loading,
        error,
        totalQuestions,
        fetchQuestionsInGroup,
        toggleQuestionStatus,
    } = useCommonQuestions();
    // Search and filter state
    const [currentSearchTerm, setCurrentSearchTerm] = useState("");
    const [currentDateRange, setCurrentDateRange] = useState<
        DateRange | undefined
    >(undefined);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    // Calculate total pages
    const totalPages = Math.ceil(totalQuestions / itemsPerPage);

    const _fetchQuestions = async (params: {
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
            await fetchQuestionsInGroup(groupId, {
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
            console.error("Error fetching questions:", error);
            toast.error("Failed to fetch questions");
        }
    };
    useEffect(() => {
        _fetchQuestions({ page: 1, limit: 10 });
    }, []);

    const handleStatusToggle = async (q: any) => {
        await toggleQuestionStatus(q.id, {
            ...q,
            status: q.status === 1 ? 0 : 1,
        });
        _fetchQuestions({ page: 1, limit: 10 });
    };
    const handleSearch = ({
        searchTerm,
        dateRange,
    }: {
        searchTerm: string;
        dateRange: DateRange | undefined;
    }) => {
        setCurrentPage(1); // Reset to first page when search changes
        _fetchQuestions({ searchTerm, dateRange, page: 1 });
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        _fetchQuestions({ page });
    };

    const handleItemsPerPageChange = (value: string) => {
        const newItemsPerPage = Number.parseInt(value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when items per page changes
        _fetchQuestions({ page: 1, limit: newItemsPerPage });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="space-y-4">
            <DataTableSearch
                placeholder="Search questions..."
                onSearch={handleSearch}
                initialSearchTerm={currentSearchTerm}
                initialDateRange={currentDateRange}
            />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {questions.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="h-24 text-center"
                                >
                                    No questions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            questions.map((q) => (
                                <TableRow key={q.id}>
                                    <TableCell>
                                        <span className="flex items-center gap-2">
                                            {q.title.length > 50
                                                ? q.title.slice(0, 50) + "..."
                                                : q.title}
                                            {q.title.length > 50 && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Info className="w-4 h-4" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {q.title}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {q.type ===
                                        COMMON_QUESTION_TYPE.SINGLE_CHOICE
                                            ? "Single Choice"
                                            : "Multiple Choice"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                q.status === 1
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {q.status === 1
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {q.createAt
                                            ? format(
                                                  new Date(q.createAt),
                                                  "yyyy-MM-dd"
                                              )
                                            : "-"}
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
                                                            `/settings/common-questions/groups/${groupId}/questions/${q.id}`
                                                        )
                                                    }
                                                >
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleStatusToggle(q)
                                                    }
                                                >
                                                    {q.status === 1
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
            {totalQuestions > 0 && (
                <DataTablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalQuestions}
                    visibleItems={questions.length}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            )}
        </div>
    );
}
