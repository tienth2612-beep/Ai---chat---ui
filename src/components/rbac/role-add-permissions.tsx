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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Search } from "lucide-react";
import * as rbacModel from "@/types/rbac";
import { DataTablePagination } from "../ui/data-table-pagination";

interface RoleAddPermissionsProps {
    roleId: string;
}

export function RoleAddPermissions({ roleId }: RoleAddPermissionsProps) {
    const router = useRouter();
    const {
        getRole,
        createRoleAssignment,
        getPermissions,
        getRoleAssignments,
        isLoading,
        permissions,
        permissionsOfRole,
        role,
        isLoading: roleLoading,
    } = useRbac();
    const [filteredPermissions, setFilteredPermissions] = useState<
        rbacModel.PermissionResponse[]
    >([]);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
        []
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([getRole(Number(roleId)), getPermissions()]);

            if (permissions) {
                // Filter out permissions that are already assigned to the role
                const permissionsOfRoleIds = permissionsOfRole.map((p) => p.id);
                const availablePermissions = permissions.filter(
                    (p) => !permissionsOfRoleIds.includes(p.id)
                );
                setFilteredPermissions(availablePermissions);
                setTotalPages(
                    Math.ceil(availablePermissions.length / itemsPerPage)
                );
            }
        };

        fetchData();
    }, [roleId, getRole, getPermissions]);

    useEffect(() => {
        // Filter permissions based on search query
        const filtered = permissions.filter(
            (p) =>
                p.permission
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPermissions(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1); // Reset to first page on new search
    }, [searchQuery, permissions]);

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
        if (!role || selectedPermissions.length === 0) return;

        setIsSaving(true);
        try {
            // Get the permission codes from the selected IDs
            const permissionCodes = selectedPermissions
                .map(
                    (id) =>
                        permissions.find((p) => p.id === id)?.permission || ""
                )
                .filter((code) => code !== "");

            const success = await createRoleAssignment({
                objectId: Number(roleId),
                permissions: selectedPermissions.map((id) => ({
                    permissionId: id,
                })),
            });

            if (success) {
                toast.success(
                    `${selectedPermissions.length} permissions have been added to this role.`
                );
                router.push(`/user-management/rbac/roles/${roleId}`);
            }
        } catch (error) {
            toast.error(
                "An error occurred while adding permissions. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        getPermissions({ page });
    };

    const handleItemsPerPageChange = (value: string) => {
        const newItemsPerPage = Number.parseInt(value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when items per page changes
        getPermissions({ page: 1, pageSize: newItemsPerPage });
    };

    // Get current items for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPermissions.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    if (roleLoading || isLoading) {
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
                    <CardTitle>Add Permissions to {role.roleName}</CardTitle>
                    <CardDescription>
                        Select the permissions you want to add to this role.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search permissions..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {currentItems.length > 0 ? (
                            <div className="space-y-4">
                                {currentItems.map((permission) => (
                                    <div
                                        key={permission.id}
                                        className="flex items-start space-x-3 p-2 hover:bg-muted rounded-md"
                                    >
                                        <Checkbox
                                            id={`permission-${permission.id}`}
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
                                                htmlFor={`permission-${permission.id}`}
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
                        ) : (
                            <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-md">
                                <p className="text-sm text-muted-foreground">
                                    {searchQuery
                                        ? "No permissions match your search"
                                        : "No available permissions to add"}
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredPermissions.length > itemsPerPage && (
                            <DataTablePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                itemsPerPage={itemsPerPage}
                                totalItems={filteredPermissions.length}
                                visibleItems={currentItems.length}
                                onPageChange={handlePageChange}
                                onItemsPerPageChange={handleItemsPerPageChange}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Button
                    onClick={handleSave}
                    disabled={isSaving || selectedPermissions.length === 0}
                >
                    {isSaving
                        ? "Saving..."
                        : `Add ${selectedPermissions.length} Permission${
                              selectedPermissions.length !== 1 ? "s" : ""
                          }`}
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
