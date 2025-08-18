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
import * as RbacModel from "@/types/rbac";

interface MembershipPermissionsFormProps {
    membershipId: string;
    currentPermissions: number[];
    onSave: (
        permissions: RbacModel.CreateAssignRequest
    ) => Promise<true | null>;
}

export function MembershipPermissionsForm({
    membershipId,
    currentPermissions,
    onSave,
}: MembershipPermissionsFormProps) {
    const router = useRouter();
    const {
        getPermissions,
        isLoading: permissionsLoading,
        permissionsOfPackage,
        getAssignOfPackage,
        permissions,
    } = useRbac();
    const [selectedPermissions, setSelectedPermissions] =
        useState<number[]>(currentPermissions);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchPermissions = async () => {
            await getAssignOfPackage(Number(membershipId));
            if (permissionsOfPackage) {
                setSelectedPermissions(
                    permissionsOfPackage.map((permission) => permission.id)
                );
            }
        };

        fetchPermissions();
    }, [getPermissions]);

    const handlePermissionChange = (permissionId: number, checked: boolean) => {
        console.log(permissionId, checked);
        if (checked) {
            setSelectedPermissions((prev) => [...prev, permissionId]);
        } else {
            setSelectedPermissions((prev) =>
                prev.filter((id) => id !== permissionId)
            );
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            console.log(selectedPermissions);
            const success = await onSave({
                objectId: Number(membershipId),
                permissions: selectedPermissions.map((permission) => ({
                    permissionId: permission,
                })),
                type: 1,
            });
            if (success) {
                toast.success(
                    "Membership permissions have been updated successfully"
                );
                router.push(`/memberships/${membershipId}`);
            }
        } catch (error) {
            toast.error(
                "An error occurred while updating permissions. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    if (permissionsLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-[150px]" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/memberships/${membershipId}`)}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Membership
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Assign Extra Permissions to Membership
                    </CardTitle>
                    <CardDescription>
                        Select additional permissions that will be granted to
                        all users with this membership, regardless of their
                        role.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {permissions.map((permission) => (
                                <div
                                    key={permission.id}
                                    className="flex items-start space-x-3 space-y-0"
                                >
                                    <Checkbox
                                        id={`membership-${permission.id}`}
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
                                            htmlFor={`membership-${permission.id}`}
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
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Permissions"}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => router.push(`/memberships/${membershipId}`)}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}
