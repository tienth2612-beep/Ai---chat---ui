"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as RbacModel from "@/types/rbac";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface SubroleTableProps {
    subroles: RbacModel.RoleResponse[];
    parentRoleId: number;
    onEdit?: (subrole: RbacModel.RoleResponse) => void;
    onDelete?: (subroleId: number) => void;
    onRefresh?: () => void;
}

export function SubroleTable({
    subroles,
    parentRoleId,
    onEdit,
    onDelete,
    onRefresh,
}: SubroleTableProps) {
    const router = useRouter();

    const handleView = (subroleId: number) => {
        router.push(`/settings/user-management/rbac/roles/${subroleId}`);
    };

    const handleEdit = (subrole: RbacModel.RoleResponse) => {
        if (onEdit) {
            onEdit(subrole);
        } else {
            router.push(
                `/settings/user-management/rbac/roles/${subrole.id}/edit`
            );
        }
    };

    const handleDelete = async (subroleId: number) => {
        if (onDelete) {
            try {
                await onDelete(subroleId);
                toast.success("Subrole deleted successfully");
                if (onRefresh) onRefresh();
            } catch (error) {
                toast.error("Failed to delete subrole");
            }
        }
    };

    if (!subroles || subroles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground mb-2">
                    No subroles found for this role
                </p>
                <p className="text-xs text-muted-foreground">
                    Subroles help organize hierarchical role structures
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Role Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subroles.map((subrole) => (
                        <TableRow key={subrole.id}>
                            <TableCell className="font-medium">
                                {subrole.roleName}
                            </TableCell>
                            <TableCell>
                                {subrole.description?.length > 50
                                    ? `${subrole.description.slice(0, 50)}...`
                                    : subrole.description || "-"}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">
                                    Level {subrole.level}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        subrole.active ? "default" : "secondary"
                                    }
                                >
                                    {subrole.active ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {formatDate(subrole.createAt)}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                        >
                                            <span className="sr-only">
                                                Open menu
                                            </span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                            Actions
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleView(subrole.id)
                                            }
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleEdit(subrole)}
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Subrole
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleDelete(subrole.id)
                                            }
                                            className="text-destructive"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Subrole
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
