"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Eye, Edit, Trash2 } from "lucide-react";
import { useRbac } from "@/hooks/use-rbac";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import { formatDate } from "@/lib/utils";
import * as RbacModel from "@/types/rbac";
import { DataTable } from "../ui/data-table";
import { DataTablePagination } from "../ui/data-table-pagination";
import { DateRange } from "react-day-picker";
import { number } from "zod";

const ActionsCell = ({ row }: { row: any }) => {
    const permission = row.original;
    const router = useRouter();
    const { updatePermission, getPermissions } = useRbac();

    const handleView = () => {
        router.push(`/user-management/rbac/permissions/${permission.id}`);
    };

    const handleEdit = () => {
        router.push(`/user-management/rbac/permissions/${permission.id}/edit`);
    };

    const handleDelete = async () => {
        try {
            const success = await updatePermission({
                id: Number(permission.id),
                active: false,
            });
            if (success) {
                toast.success("Permission deleted", {
                    description: "The permission has been deleted successfully",
                });
                await getPermissions();
            }
        } catch (error) {
            toast.error("Error", {
                description:
                    "Failed to delete permission. It may be in use by one or more roles.",
            });
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="none"
                    >
                        <path
                            d="M10 6C10.5523 6 11 5.55228 11 5C11 4.44772 10.5523 4 10 4C9.44772 4 9 4.44772 9 5C9 5.55228 9.44772 6 10 6Z"
                            fill="currentColor"
                        />
                        <path
                            d="M10 11C10.5523 11 11 10.5523 11 10C11 9.44772 10.5523 9 10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11Z"
                            fill="currentColor"
                        />
                        <path
                            d="M10 16C10.5523 16 11 15.5523 11 15C11 14.4477 10.5523 14 10 14C9.44772 14 9 14.4477 9 15C9 15.5523 9.44772 16 10 16Z"
                            fill="currentColor"
                        />
                    </svg>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {/* <DropdownMenuItem onClick={handleView}>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>View</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const usePermissionHandlers = () => {
    const router = useRouter();
    const { updatePermission, getPermissions } = useRbac();

    const handleView = useCallback(
        (id: string) => {
            router.push(`/user-management/rbac/permissions/${id}`);
        },
        [router]
    );

    const handleEdit = useCallback(
        (id: string) => {
            router.push(`/user-management/rbac/permissions/${id}/edit`);
        },
        [router]
    );

    const handleDelete = useCallback(
        async (id: string) => {
            try {
                const success = await updatePermission({
                    id: Number(id),
                    active: false,
                });
                if (success) {
                    toast.success("Permission deleted", {
                        description:
                            "The permission has been deleted successfully",
                    });
                    await getPermissions();
                }
            } catch (error) {
                toast.error("Error", {
                    description:
                        "Failed to delete permission. It may be in use by one or more roles.",
                });
            }
        },
        [updatePermission, getPermissions]
    );

    return {
        handleView,
        handleEdit,
        handleDelete,
    };
};

export function PermissionsTable() {
    const router = useRouter();
    const {
        getPermissions,
        isLoading,
        error,
        permissions,
        updatePermission,
        totalPermissions,
    } = useRbac();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(1000);
    const [currentSearchTerm, setCurrentSearchTerm] = useState("");
    const [currentDateRange, setCurrentDateRange] = useState<DateRange | null>(
        null
    );
    const fetchPermissions = async (params: {
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
            await getPermissions({
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
    useEffect(() => {
        setTotalPages(Math.ceil(permissions.length / itemsPerPage));
        fetchPermissions({ page: 1, limit: itemsPerPage });
    }, [getPermissions]);

    const handleCreatePermission = () => {
        router.push("/user-management/rbac/permissions/new");
    };

    // Define the columns for the data table
    const columns = [
        {
            accessorKey: "permission",
            header: "Permission",
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            accessorKey: "active",
            header: "Status",
            cell: ({ row }: any) => (
                <Badge variant={row.original.active ? "default" : "secondary"}>
                    {row.original.active ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }: any) => formatDate(row.original.createAt),
        },
        {
            id: "actions",
            cell: ActionsCell,
        },
    ];

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between">
                    <Skeleton className="h-10 w-[150px]" />
                    <Skeleton className="h-10 w-[100px]" />
                </div>
                <Skeleton className="h-[300px] w-full" />
            </div>
        );
    }

    if (error) {
        return <div className="text-destructive">Error: {error}</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <h3 className="text-lg font-medium">Permissions</h3>
                <Button size="sm" onClick={handleCreatePermission}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Permission
                </Button>
            </div>
            <DataTable
                columns={columns}
                data={permissions}
                searchKey="permission"
                searchPlaceholder="Search permissions..."
            />
        </div>
    );
}
