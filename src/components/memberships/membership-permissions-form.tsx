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
import { ArrowLeft, Search } from "lucide-react";
import * as RbacModel from "@/types/rbac";
import { DataTablePagination } from "../ui/data-table-pagination";
import { Input } from "../ui/input";

interface MembershipPermissionsFormProps {
    membershipId: string;
    currentPermissions: number[];
    onSave: (
        permissions: RbacModel.CreateAssignRequest
    ) => Promise<true | null>;
}

// Add type for permission filtering
type PermissionFilter = {
    searchQuery: string;
    itemsPerPage: number;
    currentPage: number;
};

// Extract permission filtering logic into a separate function
const filterPermissions = (
    permissions: RbacModel.PermissionResponse[],
    permissionsOfPackage: RbacModel.PermissionResponse[],
    filter: PermissionFilter
) => {
    const permissionsOfPackageIds = permissionsOfPackage.map((p) => p.id);
    const availablePermissions = permissions.filter(
        (p) => !permissionsOfPackageIds.includes(p.id)
    );

    const searchFiltered = availablePermissions.filter(
        (p) =>
            p.permission
                .toLowerCase()
                .includes(filter.searchQuery.toLowerCase()) ||
            p.description
                .toLowerCase()
                .includes(filter.searchQuery.toLowerCase())
    );

    const startIndex = (filter.currentPage - 1) * filter.itemsPerPage;
    const endIndex = startIndex + filter.itemsPerPage;
    const paginatedPermissions = searchFiltered.slice(startIndex, endIndex);

    return {
        filteredPermissions: searchFiltered,
        currentItems: paginatedPermissions,
        totalPages: Math.ceil(searchFiltered.length / filter.itemsPerPage),
    };
};

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
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filteredPermissions, setFilteredPermissions] = useState<
        RbacModel.PermissionResponse[]
    >([]);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                await Promise.all([
                    getPermissions(),
                    getAssignOfPackage(Number(membershipId), {}),
                ]);
            } catch (err) {
                toast.error("Failed to fetch permissions. Please try again.");
            }
        };

        fetchPermissions();
    }, [getPermissions, getAssignOfPackage, membershipId]);

    useEffect(() => {
        if (permissionsOfPackage && permissions) {
            const {
                filteredPermissions: newFiltered,
                totalPages: newTotalPages,
            } = filterPermissions(permissions, permissionsOfPackage, {
                searchQuery,
                itemsPerPage,
                currentPage,
            });

            setFilteredPermissions(newFiltered);
            setTotalPages(newTotalPages);
            //setSelectedPermissions(permissionsOfPackage.map((p) => p.id));
        }
    }, [
        permissionsOfPackage,
        permissions,
        searchQuery,
        itemsPerPage,
        currentPage,
    ]);

    const handlePermissionChange = (permissionId: number, checked: boolean) => {
        setSelectedPermissions((prev) =>
            checked
                ? [...prev, permissionId]
                : prev.filter((id) => id !== permissionId)
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        console.log(selectedPermissions);
        try {
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
                router.push(`/settings/memberships/${membershipId}`);
            } else {
                throw new Error("Failed to save permissions");
            }
        } catch (err) {
            const errorMessage =
                "An error occurred while updating permissions. Please try again.";
            toast.error(errorMessage);
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
                    onClick={() =>
                        router.push(`/settings/memberships/${membershipId}`)
                    }
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
                    {/* <div className="space-y-6">
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
                    </div> */}
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Permissions"}
                </Button>
                <Button
                    variant="outline"
                    onClick={() =>
                        router.push(`/settings/memberships/${membershipId}`)
                    }
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}
