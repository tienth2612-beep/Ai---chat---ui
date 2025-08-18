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
import * as CompanyModel from "@/types/company";
import { Input } from "../ui/input";
import { useCompany } from "@/hooks/use-company";
import { toast } from "sonner";

interface CompanyJobsTableProps {
    companyId: number;
}

export function CompanyJobsTable({ companyId }: { companyId: number }) {
    const { companyJobs, isLoading, error, getCompanyJobs } = useCompany();
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        try {
            getCompanyJobs(companyId.toString(), { page, pageSize });
            setTotalPages(Math.ceil(companyJobs.length / pageSize));
        } catch (error) {
            console.error(error);
            toast.error("Error fetching jobs");
        }
    }, [companyId, page, pageSize]);

    const paginatedJobs = companyJobs.slice(
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

    const getStatusBadge = (status: number) => {
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
        }
    };

    if (companyJobs.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No jobs found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search jobs..."
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
                            <TableHead>Title</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {companyJobs.map((job) => (
                            <TableRow
                                key={job.id}
                                className="cursor-pointer hover:bg-muted/50"
                            >
                                <TableCell className="font-medium">
                                    {job.jobNo || "-"}
                                </TableCell>
                                <TableCell>{job.title || "-"}</TableCell>
                                <TableCell>{job.clientTitle || "-"}</TableCell>
                                <TableCell>
                                    {format(
                                        new Date(job.startDate),
                                        "dd/MM/yyyy"
                                    )}
                                </TableCell>
                                <TableCell>
                                    ${job.total.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(job.status)}
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
