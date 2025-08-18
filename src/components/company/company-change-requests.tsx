"use client";

import { useEffect, useState } from "react";
import { useCompany } from "@/hooks/use-company";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import * as CompanyModel from "@/types/company";
import { COMMON_STATUS } from "@/lib/constants";

interface CompanyChangeRequestsProps {
    companyId: string;
}

export function CompanyChangeRequests({
    companyId,
}: CompanyChangeRequestsProps) {
    const {
        companyRequestsUpdate,
        totalCompanyRequestsUpdate,
        getCompanyRequestsUpdate,
        getCompanyRequestUpdateById,
        updateCompanyRequestUpdate,
        getCompanyById,
    } = useCompany();

    const [selectedRequest, setSelectedRequest] =
        useState<CompanyModel.DetailCompanyResponse | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [company, setCompany] =
        useState<CompanyModel.DetailCompanyResponse | null>(null);

    useEffect(() => {
        loadRequests();
    }, [companyId]);

    const loadRequests = async () => {
        await getCompanyRequestsUpdate(companyId);
    };

    const handleViewDetail = async (requestId: string) => {
        const request = await getCompanyRequestUpdateById(companyId, requestId);
        const company = await getCompanyById(companyId);
        setCompany(company);
        setSelectedRequest(request);
        setIsDetailOpen(true);
    };

    const handleApprove = async (requestId: string) => {
        try {
            await updateCompanyRequestUpdate(companyId, requestId, {
                status: COMMON_STATUS.ACTIVE.toString(),
            });
            toast.success("Request approved successfully");
            setIsDetailOpen(false);
            loadRequests();
        } catch (error) {
            toast.error("Failed to approve request");
        }
    };

    const handleReject = async (requestId: string) => {
        try {
            await updateCompanyRequestUpdate(companyId, requestId, {
                status: COMMON_STATUS.INACTIVE.toString(),
            });
            toast.success("Request rejected successfully");
            setIsDetailOpen(false);
            loadRequests();
        } catch (error) {
            toast.error("Failed to reject request");
        }
    };

    const getStatusBadge = (status: number) => {
        const statusMap: Record<string, { color: string; label: string }> = {
            "0": { color: "bg-yellow-500", label: "Pending" },
            "1": { color: "bg-green-500", label: "Approved" },
            "-1": { color: "bg-red-500", label: "Rejected" },
        };

        const { color, label } = statusMap[status.toString()] || {
            color: "bg-gray-500",
            label: status,
        };

        return <Badge className={color}>{label}</Badge>;
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Change Requests</h2>
                <div className="text-sm text-gray-500">
                    Total: {totalCompanyRequestsUpdate}
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Requested At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {companyRequestsUpdate.map((request) => (
                        <TableRow key={request.id}>
                            <TableCell>{request.id}</TableCell>
                            <TableCell>
                                {getStatusBadge(request.status)}
                            </TableCell>
                            <TableCell>
                                {format(new Date(request.updateAt), "PPp")}
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handleViewDetail(request.id.toString())
                                    }
                                >
                                    View Details
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Request Details</DialogTitle>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold">
                                        Request ID
                                    </h3>
                                    <p>{selectedRequest.id}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Status</h3>
                                    <p>
                                        {getStatusBadge(selectedRequest.status)}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        Requested At
                                    </h3>
                                    <p>
                                        {format(
                                            new Date(selectedRequest.updateAt),
                                            "PPp"
                                        )}
                                    </p>
                                </div>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Field</TableHead>
                                        <TableHead>Old Value</TableHead>
                                        <TableHead>New Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.entries(selectedRequest).map(
                                        ([key, value]) => {
                                            // Skip these fields as they are not part of the comparison
                                            if (
                                                [
                                                    "id",
                                                    "status",
                                                    "updateAt",
                                                    "updateBy",
                                                    "createAt",
                                                    "createBy",
                                                    "companyId",
                                                ].includes(key)
                                            ) {
                                                return null;
                                            }

                                            const oldValue =
                                                company?.[
                                                    key as keyof CompanyModel.DetailCompanyResponse
                                                ];
                                            const newValue = value;

                                            // Only show rows where values are different
                                            if (oldValue !== newValue) {
                                                return (
                                                    <TableRow key={key}>
                                                        <TableCell className="font-medium">
                                                            {key
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                key
                                                                    .slice(1)
                                                                    .replace(
                                                                        /([A-Z])/g,
                                                                        " $1"
                                                                    )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {typeof oldValue ===
                                                            "boolean"
                                                                ? oldValue
                                                                    ? "Yes"
                                                                    : "No"
                                                                : oldValue ||
                                                                  "-"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {typeof newValue ===
                                                            "boolean"
                                                                ? newValue
                                                                    ? "Yes"
                                                                    : "No"
                                                                : newValue ||
                                                                  "-"}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                            return null;
                                        }
                                    )}
                                </TableBody>
                            </Table>

                            {selectedRequest.status === 0 && (
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            handleReject(
                                                selectedRequest.id.toString()
                                            )
                                        }
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            handleApprove(
                                                selectedRequest.id.toString()
                                            )
                                        }
                                    >
                                        Approve
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
