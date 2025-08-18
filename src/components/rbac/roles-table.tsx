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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
export function RolesTable() {
    const router = useRouter();
    const { getRoles, isLoading, error, roles } = useRbac();

    const fetchRoles = useCallback(async () => {
        await getRoles({ page: 1, pageSize: 10 });
    }, [getRoles]);

    useEffect(() => {
        fetchRoles();
    }, [getRoles]);
    console.log(roles);
    const handleCreateRole = () => {
        router.push("/user-management/rbac/roles/new");
    };

    const handleViewRole = (id: string) => {
        router.push(`/user-management/rbac/roles/${id}`);
    };

    const handleEditRole = (id: string) => {
        router.push(`/user-management/rbac/roles/${id}/edit`);
    };

    const handleDeleteRole = async (id: string) => {
        // In a real app, you would call the delete API here
        toast.success("Role deleted");
        // Refresh the roles list
        await getRoles();
        router.refresh();
    };

    // Define the columns for the data table
    const columns = [
        {
            accessorKey: "roleName",
            header: "Role Name",
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }: any) => format(row.original.createAt, "yyyy-MM-dd"),
        },
        {
            id: "actions",
            cell: ({ row }: any) => {
                const role = row.original;

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
                            <DropdownMenuItem
                                onClick={() => handleViewRole(role.id)}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View</span>
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem
                                onClick={() => handleEditRole(role.id)}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                            </DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleDeleteRole(role.id)}
                                className="text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
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
                <h3 className="text-lg font-medium">Roles</h3>
                <Button size="sm" onClick={handleCreateRole}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Role
                </Button>
            </div>
            <DataTable columns={columns} data={roles} />
        </div>
    );
}
