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

import * as MembershipModel from "@/types/membership";
import * as RoleModel from "@/types/rbac";
import { DataTablePagination } from "../ui/data-table-pagination";

interface MembershipAddRolesProps {
    membershipId: string;
    membership: MembershipModel.PackageResponse;
    onAddRoles: (membershipId: string, roles: number[]) => Promise<true | null>;
}

export function MembershipAddRoles({
    membershipId,
    membership,
    onAddRoles,
}: MembershipAddRolesProps) {
    const router = useRouter();
    const {
        getRoles,
        getPackageRoles,
        isLoading: rolesLoading,
        roles,
        rolesOfPackage,
    } = useRbac();
    const [allRoles, setAllRoles] = useState<RoleModel.RoleResponse[]>([]);
    const [filteredRoles, setFilteredRoles] = useState<
        RoleModel.RoleResponse[]
    >([]);
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchRoles = async () => {
            await getRoles();
            await getPackageRoles(membership.id);
        };

        fetchRoles();
    }, [membership, getRoles, getPackageRoles]);

    useEffect(() => {
        if (roles && rolesOfPackage) {
            const rolesOfPackageIds = rolesOfPackage.map((r) => r.id);
            const availableRoles = roles.filter(
                (r) => !rolesOfPackageIds.includes(r.id)
            );
            setAllRoles(availableRoles);
            setFilteredRoles(availableRoles);
            setTotalPages(Math.ceil(availableRoles.length / itemsPerPage));
        }
    }, [roles, rolesOfPackage]);

    useEffect(() => {
        // Filter roles based on search query
        const filtered = allRoles.filter(
            (r) =>
                r.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRoles(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1); // Reset to first page on new search
    }, [searchQuery, allRoles]);

    const handleRoleChange = (roleId: number, checked: boolean) => {
        if (checked) {
            setSelectedRoles((prev) => [...prev, roleId]);
        } else {
            setSelectedRoles((prev) => prev.filter((id) => id !== roleId));
        }
    };

    const handleSave = async () => {
        if (!membership || selectedRoles.length === 0) return;

        setIsSaving(true);
        try {
            // Get the role names from the selected IDs
            const roleIds = selectedRoles
                .map((id) => allRoles.find((r) => r.id === id)?.id || 0)
                .filter((id) => id !== 0);

            const success = await onAddRoles(membershipId, roleIds);

            if (success) {
                toast.success(
                    `${selectedRoles.length} roles have been added to this membership.`
                );
                router.push(`/memberships/${membershipId}`);
            }
        } catch (error) {
            toast.error(
                "An error occurred while adding roles. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    // Get current items for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRoles.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(parseInt(value));
    };

    if (rolesLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-[150px]" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    if (!membership) {
        return <div>Membership not found</div>;
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
                    <CardTitle>Add Roles to {membership.name}</CardTitle>
                    <CardDescription>
                        Select the roles you want to add to this membership.
                        Users with this membership will have all permissions
                        from these roles.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search roles..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {currentItems.length > 0 ? (
                            <div className="space-y-4">
                                {currentItems.map((role) => (
                                    <div
                                        key={role.id}
                                        className="flex items-start space-x-3 p-2 hover:bg-muted rounded-md"
                                    >
                                        <Checkbox
                                            id={`membership-role-${role.id}`}
                                            checked={selectedRoles.includes(
                                                role.id
                                            )}
                                            onCheckedChange={(checked) =>
                                                handleRoleChange(
                                                    role.id,
                                                    checked as boolean
                                                )
                                            }
                                        />
                                        <div className="space-y-1 leading-none">
                                            <label
                                                htmlFor={`membership-role-${role.id}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {role.roleName}
                                            </label>
                                            <p className="text-xs text-muted-foreground">
                                                {role.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-md">
                                <p className="text-sm text-muted-foreground">
                                    {searchQuery
                                        ? "No roles match your search"
                                        : "No available roles to add"}
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredRoles.length > itemsPerPage && (
                            <DataTablePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                itemsPerPage={itemsPerPage}
                                totalItems={filteredRoles.length}
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
                    disabled={isSaving || selectedRoles.length === 0}
                >
                    {isSaving
                        ? "Saving..."
                        : `Add ${selectedRoles.length} Role${
                              selectedRoles.length !== 1 ? "s" : ""
                          }`}
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
