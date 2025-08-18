"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
    PlusCircle,
    Search,
    CreditCard,
    DollarSign,
    AlertCircle,
} from "lucide-react";
import * as PaymentModel from "@/types/payment";
import { toast } from "sonner";
import { usePayment } from "@/hooks/use-payment";
import { DataTableSearch } from "../data-table-search";
import { DateRange } from "react-day-picker";
interface CompanyPaymentHistoryProps {
    companyId: number;
}

export function CompanyPaymentHistory({
    companyId,
}: CompanyPaymentHistoryProps) {
    const { payments, isLoading, error, getPaymentHistoryByCompanyId } =
        usePayment();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentSearchTerm, setCurrentSearchTerm] = useState("");
    const [currentDateRange, setCurrentDateRange] = useState<
        DateRange | undefined
    >(undefined);

    useEffect(() => {
        if (companyId) {
            getPaymentHistoryByCompanyId(companyId, {
                page: currentPage,
                pageSize: itemsPerPage,
                search: searchQuery,
            });
        }
    }, [companyId]);

    const handleSearch = ({
        searchTerm,
        dateRange,
    }: {
        searchTerm: string;
        dateRange: DateRange | undefined;
    }) => {
        setCurrentPage(1); // Reset to first page when search changes
        getPaymentHistoryByCompanyId(companyId, {
            search: searchTerm,
            page: currentPage,
            pageSize: itemsPerPage,
        });
    };

    const getStatusBadge = (status: number) => {
        switch (status) {
            case 1:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Paid
                    </span>
                );
            case 0:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                    </span>
                );
            case -1:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Failed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    const getMethodIcon = (method: number) => {
        switch (method) {
            case 1:
                return (
                    <CreditCard className="h-4 w-4 mr-1.5 text-muted-foreground" />
                );
            case 2:
                return (
                    <DollarSign className="h-4 w-4 mr-1.5 text-muted-foreground" />
                );
            default:
                return null;
        }
    };

    const formatMethod = (method: number) => {
        switch (method) {
            case 1:
                return "Credit Card";
            case 2:
                return "Bank Transfer";
            case 3:
                return "Cash";
            default:
                return "Unknown";
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                {/* <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button size="sm" className="h-9">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Payment
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Payment Record</DialogTitle>
                            <DialogDescription>
                                Create a new payment record for this company.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount ($)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={newPayment.amount}
                                        onChange={(e) =>
                                            setNewPayment({
                                                ...newPayment,
                                                amount: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={newPayment.date}
                                        onChange={(e) =>
                                            setNewPayment({
                                                ...newPayment,
                                                date: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={newPayment.status}
                                        onValueChange={(value) =>
                                            setNewPayment({
                                                ...newPayment,
                                                status: value as
                                                    | "paid"
                                                    | "pending"
                                                    | "failed",
                                            })
                                        }
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="paid">
                                                Paid
                                            </SelectItem>
                                            <SelectItem value="pending">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="failed">
                                                Failed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="method">
                                        Payment Method
                                    </Label>
                                    <Select
                                        value={newPayment.method}
                                        onValueChange={(value) =>
                                            setNewPayment({
                                                ...newPayment,
                                                method: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger id="method">
                                            <SelectValue placeholder="Select method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="credit_card">
                                                Credit Card
                                            </SelectItem>
                                            <SelectItem value="bank_transfer">
                                                Bank Transfer
                                            </SelectItem>
                                            <SelectItem value="cash">
                                                Cash
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    placeholder="Payment description"
                                    value={newPayment.description}
                                    onChange={(e) =>
                                        setNewPayment({
                                            ...newPayment,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsAddDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleAddPayment}>
                                Add Payment
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog> */}
            </CardHeader>
            <CardContent>
                <DataTableSearch
                    placeholder="Search payments..."
                    onSearch={handleSearch}
                    initialSearchTerm={currentSearchTerm}
                    initialDateRange={currentDateRange}
                />

                {payments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <CreditCard className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-1">
                            No payment records
                        </h3>
                        {/* <p className="text-muted-foreground mb-4">
                            Add payment records to track company payments.
                        </p> */}
                        {/* <Button
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(true)}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add First Payment
                        </Button> */}
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-medium">
                                            {format(
                                                new Date(payment.createAt),
                                                "MMM d, yyyy"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {payment.description}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                {getMethodIcon(payment.type)}
                                                {formatMethod(payment.type)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            ${payment.value.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(payment.status)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
