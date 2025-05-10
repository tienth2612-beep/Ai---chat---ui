"use client";

import { useEffect, useState } from "react";
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
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useCompany } from "@/hooks/use-company";
import { toast } from "sonner";
export function CompanyQuotesTable({ companyId }: { companyId: number }) {
    const { companyQuotes, isLoading, error, getCompanyQuotes } = useCompany();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const pageSize = 5;

    useEffect(() => {
        try {
            getCompanyQuotes(companyId.toString(), { page, pageSize });
            setTotalPages(Math.ceil(companyQuotes.length / pageSize));
        } catch (error) {
            console.error(error);
            toast.error("Error fetching quotes");
        }
    }, [companyId, page, pageSize]);

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

    const getStatusBadge = (status: number) => {
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
    };

    if (companyQuotes.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No quotes found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search quotes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No.</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {companyQuotes.map((quote) => (
                            <TableRow
                                key={quote.id}
                                className="cursor-pointer hover:bg-muted/50"
                            >
                                <TableCell className="font-medium">
                                    {quote.id || "-"}
                                </TableCell>
                                <TableCell>{quote.name || "-"}</TableCell>
                                <TableCell>
                                    {format(
                                        new Date(quote.dueDate),
                                        "dd/MM/yyyy"
                                    )}
                                </TableCell>
                                <TableCell>
                                    ${quote.total.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(quote.status)}
                                </TableCell>
                                <TableCell>
                                    {format(
                                        new Date(quote.createAt),
                                        "dd/MM/yyyy"
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
