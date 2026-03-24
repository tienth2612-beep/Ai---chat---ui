"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    PlusCircle,
    Eye,
    Edit,
    Trash2,
    ChevronRight,
    ChevronDown,
    Users,
} from "lucide-react";
import { useRbac } from "@/hooks/use-rbac";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import * as RbacModel from "@/types/rbac";
import { SubroleForm } from "./subrole-form";

export function RolesTable() {
    const router = useRouter();
    const { getRoles, isLoading, error, roles } = useRbac();

    // State for collapsible rows and subrole dialog
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const [showSubroleDialog, setShowSubroleDialog] = useState(false);
    const [selectedParentRole, setSelectedParentRole] =
        useState<RbacModel.RoleResponse | null>(null);

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

    // Handle row expansion/collapse
    const toggleRowExpansion = (roleId: number) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(roleId)) {
            newExpandedRows.delete(roleId);
        } else {
            newExpandedRows.add(roleId);
        }
        setExpandedRows(newExpandedRows);
    };

    // Handle adding subrole
    const handleAddSubrole = (parentRole: RbacModel.RoleResponse) => {
        setSelectedParentRole(parentRole);
        setShowSubroleDialog(true);
    };

    // Handle subrole form success
    const handleSubroleSuccess = () => {
        setShowSubroleDialog(false);
        setSelectedParentRole(null);
        fetchRoles(); // Refresh the roles list
    };

    // Render actions dropdown for a role
    const renderActionsDropdown = (role: RbacModel.RoleResponse) => (
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
                    onClick={() => handleViewRole(role.id.toString())}
                >
                    <Eye className="mr-2 h-4 w-4" />
                    <span>View</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddSubrole(role)}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Add Subrole</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => handleDeleteRole(role.id.toString())}
                    className="text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

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
        <>
            <div className="space-y-4">
                <div className="flex justify-between">
                    <h3 className="text-lg font-medium">Roles</h3>
                    <Button size="sm" onClick={handleCreateRole}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Create Role
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12"></TableHead>
                                <TableHead>Role Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map((role) => (
                                <React.Fragment key={role.id}>
                                    {/* Main role row */}
                                    <TableRow>
                                        <TableCell>
                                            {role.subRoles &&
                                                role.subRoles.length > 0 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() =>
                                                            toggleRowExpansion(
                                                                role.id
                                                            )
                                                        }
                                                    >
                                                        {expandedRows.has(
                                                            role.id
                                                        ) ? (
                                                            <ChevronDown className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronRight className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {role.roleName}
                                        </TableCell>
                                        <TableCell>
                                            {role.description?.length > 50
                                                ? `${role.description.slice(
                                                      0,
                                                      50
                                                  )}...`
                                                : role.description || "-"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                Level {role.level}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    role.active
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {role.active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {format(
                                                new Date(role.createAt),
                                                "yyyy-MM-dd"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {renderActionsDropdown(role)}
                                        </TableCell>
                                    </TableRow>

                                    {/* Subroles rows (expanded) */}
                                    {expandedRows.has(role.id) &&
                                        role.subRoles &&
                                        role.subRoles.map((subrole) => (
                                            <TableRow
                                                key={`subrole-${subrole.id}`}
                                                className="bg-muted/50"
                                            >
                                                <TableCell></TableCell>
                                                <TableCell className="pl-8">
                                                    <div className="flex items-center">
                                                        <span className="text-muted-foreground mr-2">
                                                            └─
                                                        </span>
                                                        {subrole.roleName}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {subrole.description
                                                        ?.length > 50
                                                        ? `${subrole.description.slice(
                                                              0,
                                                              50
                                                          )}...`
                                                        : subrole.description ||
                                                          "-"}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        Level {subrole.level}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            subrole.active
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {subrole.active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {format(
                                                        new Date(
                                                            subrole.createAt
                                                        ),
                                                        "yyyy-MM-dd"
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {renderActionsDropdown(
                                                        subrole
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Subrole Dialog */}
            <Dialog
                open={showSubroleDialog}
                onOpenChange={setShowSubroleDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Subrole</DialogTitle>
                        <DialogDescription>
                            Create a new subrole under "
                            {selectedParentRole?.roleName}"
                        </DialogDescription>
                    </DialogHeader>
                    {selectedParentRole && (
                        <SubroleForm
                            parentRoleId={selectedParentRole.id}
                            parentLevel={selectedParentRole.level}
                            onSuccess={handleSubroleSuccess}
                            onCancel={() => setShowSubroleDialog(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
