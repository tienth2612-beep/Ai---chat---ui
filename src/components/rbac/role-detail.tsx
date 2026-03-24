"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, ArrowLeft, PlusCircle, X, Search, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import * as RbacModel from "@/types/rbac";
import { useRbac } from "@/hooks/use-rbac";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { DataTable } from "../ui/data-table";
import { Switch } from "../ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { SubroleTable } from "./subrole-table";
import { SubroleForm } from "./subrole-form";
interface RoleDetailProps {
    id: string;
}

export function RoleDetail({ id }: RoleDetailProps) {
    const router = useRouter();
    const {
        isLoading,
        error,
        updateRoleAssignment,
        getRole,
        getRoleAssignments,
        permissionsOfRole,
        role,
        updateRole,
    } = useRbac();

    // State for subrole management
    const [showSubroleDialog, setShowSubroleDialog] = useState(false);
    const [editingSubrole, setEditingSubrole] =
        useState<RbacModel.RoleResponse | null>(null);

    useEffect(() => {
        const fetchRole = async () => {
            await getRole(Number(id));
            await getRoleAssignments(Number(id), {}); // Fetch permissions to display details
        };

        fetchRole();
    }, [id, getRole, getRoleAssignments]);

    const handleBack = () => {
        router.push("/user-management/rbac/roles");
    };

    const handleEdit = () => {
        router.push(`/user-management/rbac/roles/${id}/edit`);
    };

    const handleAddPermissions = () => {
        router.push(`/user-management/rbac/roles/${id}/add-permissions`);
    };
    const handleTogglePermission = async (
        permissionId: number,
        active: boolean
    ) => {
        if (!role) return;

        try {
            const success = await updateRoleAssignment({
                id: permissionId,
                active: active,
            });
            if (success) {
                await getRoleAssignments(Number(id), {});

                toast.success(
                    `Permission has been ${
                        active ? "activated" : "deactivated"
                    } successfully.`
                );
            }
        } catch (error) {
            toast.error(
                "Failed to update permission status. Please try again."
            );
        }
    };
    // Define the columns for the permissions table
    const permissionColumns = [
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
            cell: ({ row }: any) => {
                const permission = row.original;
                return (
                    <div className="flex items-center">
                        <Switch
                            checked={permission.active}
                            onCheckedChange={(checked) =>
                                handleTogglePermission(permission.id, checked)
                            }
                        />
                        <span className="ml-2 text-xs">
                            {permission.active ? "Active" : "Inactive"}
                        </span>
                    </div>
                );
            },
        },
        // {
        //     id: "actions",
        //     cell: ({ row }: any) => {
        //         const permission = row.original;
        //         return (
        //             <Button
        //                 variant="ghost"
        //                 size="sm"
        //                 className="h-8 w-8 p-0 text-destructive"
        //                 onClick={() =>
        //                     handleRemovePermission(permission.permission)
        //                 }
        //             >
        //                 <X className="h-4 w-4" />
        //                 <span className="sr-only">Remove</span>
        //             </Button>
        //         );
        //     },
        // },
    ];
    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between">
                    <Skeleton className="h-10 w-[150px]" />
                    <Skeleton className="h-10 w-[100px]" />
                </div>
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    if (error) {
        return <div className="text-destructive">Error: {error}</div>;
    }

    if (!role) {
        return <div>Role not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Roles
                </Button>
                <div className="flex gap-2">
                    <Button size="sm" onClick={handleEdit}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Role
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddPermissions}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Permissions
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{role.roleName}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="text-sm font-medium mb-2">
                            Role Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Description
                                </p>
                                <p className="text-sm font-medium">
                                    {role.description}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Created At
                                </p>
                                <p className="text-sm font-medium">
                                    {formatDate(role.createAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">
                            Permissions ({permissionsOfRole.length})
                        </p>
                        {permissionsOfRole.length > 0 && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleAddPermissions}
                            >
                                <PlusCircle className="mr-2 h-4 w-4" /> Add More
                            </Button>
                        )}
                    </div>

                    {permissionsOfRole.length > 0 ? (
                        <div className="space-y-4">
                            <DataTable
                                columns={permissionColumns}
                                data={permissionsOfRole}
                                searchKey="permission"
                                searchPlaceholder="Filter permissions..."
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-md">
                            <p className="text-sm text-muted-foreground mb-2">
                                No permissions assigned to this role
                            </p>
                            <Button size="sm" onClick={handleAddPermissions}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add
                                Permissions
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
