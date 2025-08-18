"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRbac } from "@/hooks/use-rbac";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import * as rbacTypes from "@/types/rbac";

interface RolePermissionsFormProps {
    roleId: string;
}

export function RolePermissionsForm({ roleId }: RolePermissionsFormProps) {
    const router = useRouter();
    const {
        getRole,
        createRoleAssignment,
        getRoleAssignments,
        isLoading: roleLoading,
        getPermissions,
        isLoading: permissionsLoading,
        permissionsOfRole,
        permissions,
        role,
    } = useRbac();
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
        []
    );
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([
                getRole(Number(roleId)),
                getPermissions(),
                getRoleAssignments(Number(roleId), {}),
            ]);

            setSelectedPermissions(
                permissionsOfRole.map((permission) => permission.id)
            );
        };

        fetchData();
    }, [roleId, getRole, getPermissions, getRoleAssignments]);

    const handlePermissionChange = (permissionId: number, checked: boolean) => {
        if (checked) {
            setSelectedPermissions((prev) => [...prev, permissionId]);
        } else {
            setSelectedPermissions((prev) =>
                prev.filter((id) => id !== permissionId)
            );
        }
    };

    const handleSave = async () => {
        if (!role) return;

        setIsSaving(true);
        try {
            const updatedRole = await createRoleAssignment({
                objectId: Number(roleId),
                permissions: selectedPermissions.map((id) => ({
                    permissionId: id,
                })),
            });

            if (updatedRole) {
                toast.success("Permissions updated");
                router.push(`/user-management/rbac/roles/${roleId}`);
            }
        } catch (error) {
            toast.error("Error updating permissions");
        } finally {
            setIsSaving(false);
        }
    };

    if (roleLoading || permissionsLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-[150px]" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    if (!role) {
        return <div>Role not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        router.push(`/user-management/rbac/roles/${roleId}`)
                    }
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Role
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Assign Permissions to {role.roleName}</CardTitle>
                    <CardDescription>
                        Select the permissions you want to assign to this role.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {permissions.map((permission) => (
                            <div
                                key={permission.id}
                                className="flex items-start space-x-3 space-y-0"
                            >
                                <Checkbox
                                    id={permission.id.toString()}
                                    checked={selectedPermissions.includes(
                                        permission.id
                                    )}
                                    onCheckedChange={(checked) =>
                                        handlePermissionChange(
                                            permission.id,
                                            checked as boolean
                                        )
                                    }
                                />
                                <div className="space-y-1 leading-none">
                                    <label
                                        htmlFor={permission.id.toString()}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {permission.permission}
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        {permission.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Permissions"}
                </Button>
                <Button
                    variant="outline"
                    onClick={() =>
                        router.push(`/user-management/rbac/roles/${roleId}`)
                    }
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}
