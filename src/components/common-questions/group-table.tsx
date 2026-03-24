"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Eye } from "lucide-react";
import { useCommonQuestions } from "@/hooks/use-common-questions";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { GroupForm } from "@/components/common-questions/group-form";

export function GroupTable() {
    const router = useRouter();
    const { groups, loading, error, fetchGroups, toggleGroupStatus } =
        useCommonQuestions();

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState<any>(null);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const handleStatusToggle = async (group: any) => {
        try {
            await toggleGroupStatus(group.id, {
                name: group.name,
                description: group.description,
            });
            toast.success("Group status updated successfully");
            fetchGroups();
        } catch (error) {
            toast.error("Failed to update group status");
        }
    };

    const handleEdit = (group: any) => {
        setEditingGroup(group);
        setShowEditModal(true);
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        setEditingGroup(null);
        fetchGroups();
        toast.success("Group updated successfully");
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {groups.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-24 text-center"
                                >
                                    No groups found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            groups.map((group) => (
                                <TableRow key={group.id}>
                                    <TableCell className="font-medium">
                                        {group.name}
                                    </TableCell>
                                    <TableCell>
                                        {group.description.length > 100
                                            ? `${group.description.slice(
                                                  0,
                                                  100
                                              )}...`
                                            : group.description}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                group.status
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {group.status
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {group.createAt
                                            ? format(
                                                  new Date(group.createAt),
                                                  "yyyy-MM-dd"
                                              )
                                            : "-"}
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
                                                        router.push(
                                                            `/settings/common-questions/groups/${group.id}`
                                                        )
                                                    }
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Questions
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleEdit(group)
                                                    }
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Group
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleStatusToggle(
                                                            group
                                                        )
                                                    }
                                                >
                                                    {group.status
                                                        ? "Deactivate"
                                                        : "Activate"}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Group</DialogTitle>
                        <DialogDescription>
                            Update the group information.
                        </DialogDescription>
                    </DialogHeader>
                    <GroupForm
                        group={editingGroup}
                        onSuccess={handleEditSuccess}
                        onCancel={() => setShowEditModal(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
