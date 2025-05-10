"use client";

import { useState } from "react";
import { format } from "date-fns";
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
    ChevronLeft,
    ChevronRight,
    FileText,
    Briefcase,
    Receipt,
} from "lucide-react";
import type { CompanyActiveWorkResponse } from "@/types/company";

interface CompanyActiveTableProps {
    activeItems: CompanyActiveWorkResponse[];
}

export function CompanyActiveTable({ activeItems }: CompanyActiveTableProps) {
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const totalPages = Math.ceil(activeItems.length / pageSize);

    const paginatedItems = activeItems.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const getStatusBadge = (status: number, type: string) => {
        // Quote statuses
        if (type === "quote") {
            switch (status) {
                case 0:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-800 hover:bg-gray-100 border-gray-200"
                        >
                            Draft
                        </Badge>
                    );
                case 1:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border-yellow-200"
                        >
                            Awaiting response
                        </Badge>
                    );
                case 2:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-green-50 text-green-800 hover:bg-green-100 border-green-200"
                        >
                            Changes Requested
                        </Badge>
                    );
                case 3:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-red-50 text-red-800 hover:bg-red-100 border-red-200"
                        >
                            Approved
                        </Badge>
                    );
                case 4:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-800 hover:bg-gray-100 border-gray-200"
                        >
                            Converted
                        </Badge>
                    );
                case 5:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-800 hover:bg-gray-100 border-gray-200"
                        >
                            Archived
                        </Badge>
                    );
                default:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-800 hover:bg-gray-100 border-gray-200"
                        >
                            Unknown
                        </Badge>
                    );
            }
        }

        // Job statuses
        if (type === "job") {
            switch (status) {
                case 0:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-800 hover:bg-gray-100 border-gray-200"
                        >
                            Offering
                        </Badge>
                    );
                case 1:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-green-50 text-green-800 hover:bg-green-100 border-green-200"
                        >
                            Assigned
                        </Badge>
                    );
                case 5:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200"
                        >
                            RequiresInvoicing
                        </Badge>
                    );
                case 6:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200"
                        >
                            Done
                        </Badge>
                    );
                default:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-800 hover:bg-gray-100 border-gray-200"
                        >
                            Unknown
                        </Badge>
                    );
            }
        }

        // Invoice statuses
        if (type === "invoice") {
            switch (status) {
                case 0:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-800 hover:bg-gray-100 border-gray-200"
                        >
                            Approved
                        </Badge>
                    );
                case 1:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-green-50 text-green-800 hover:bg-green-100 border-green-200"
                        >
                            Awaiting Payment
                        </Badge>
                    );
                case 2:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200"
                        >
                            Paid
                        </Badge>
                    );
                case 3:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-red-50 text-red-800 hover:bg-red-100 border-red-200"
                        >
                            Partially Paid
                        </Badge>
                    );
                case 4:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-800 hover:bg-gray-100 border-gray-200"
                        >
                            Overdue
                        </Badge>
                    );
                case -1:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-800 hover:bg-gray-100 border-gray-200"
                        >
                            Cancelled
                        </Badge>
                    );
                case 6:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-800 hover:bg-gray-100 border-gray-200"
                        >
                            BadDebt
                        </Badge>
                    );
                default:
                    return (
                        <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-800 hover:bg-gray-100 border-gray-200"
                        >
                            Unknown
                        </Badge>
                    );
            }
        }

        return (
            <Badge
                variant="outline"
                className="bg-gray-50 text-gray-800 hover:bg-gray-100 border-gray-200"
            >
                Unknown
            </Badge>
        );
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "quote":
                return <FileText className="h-4 w-4 text-blue-500" />;
            case "job":
                return <Briefcase className="h-4 w-4 text-green-500" />;
            case "invoice":
                return <Receipt className="h-4 w-4 text-purple-500" />;
            default:
                return null;
        }
    };

    if (activeItems.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No active items found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>No.</TableHead>
                            <TableHead>Title/Name</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedItems.map((item) => (
                            <TableRow
                                key={`${item.type}-${item.id}`}
                                className="cursor-pointer hover:bg-muted/50"
                            >
                                <TableCell>
                                    <div className="flex items-center">
                                        {getTypeIcon(item.type || "")}
                                        <span className="ml-2 capitalize">
                                            {item.type}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {item.no || "-"}
                                </TableCell>
                                <TableCell>{item.title || "-"}</TableCell>
                                <TableCell>
                                    {format(
                                        new Date(item.dueDate),
                                        "dd/MM/yyyy"
                                    )}
                                </TableCell>
                                <TableCell>
                                    ${item.total.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(
                                        item.status,
                                        item.type || ""
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}
        </div>
    );
}
