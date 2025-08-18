"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, Edit, Plus, PlusCircle, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import * as MembershipModel from "@/types/membership";
import * as RoleModel from "@/types/rbac";
import { Skeleton } from "../ui/skeleton";
import { DataTable } from "../ui/data-table";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface MembershipDetailProps {
    id: number;
    membership: MembershipModel.PackageResponse;
    permissions: RoleModel.PermissionResponse[];
    roles: RoleModel.RoleResponse[];
    onRemovePermission: (
        id: number,
        permission: number,
        active: boolean
    ) => Promise<true | null>;
    onRemoveRole: (
        id: number,
        role: number,
        active: boolean
    ) => Promise<true | null>;
}

export function MembershipDetail({
    id,
    membership,
    onRemovePermission,
    permissions,
    onRemoveRole,
    roles,
}: MembershipDetailProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("permissions");
    const [isRemovingPermission, setIsRemovingPermission] = useState(false);
    const [isRemovingRole, setIsRemovingRole] = useState(false);
    const [permissionToRemove, setPermissionToRemove] = useState<number | null>(
        null
    );
    const [roleToRemove, setRoleToRemove] = useState<number | null>(null);

    const handleEditMembership = () => {
        router.push(`/memberships/${id}/edit`);
    };

    const handleAddPermissions = () => {
        router.push(`/memberships/${id}/permissions`);
    };

    const handleAddRoles = () => {
        router.push(`/memberships/${id}/roles`);
    };

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
                                onRemovePermission(
                                    membership.id,
                                    permission.id,
                                    checked
                                )
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
    const roleColumns = [
        {
            accessorKey: "roleName",
            header: "Role Name",
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            accessorKey: "active",
            header: "Status",
            cell: ({ row }: any) => {
                const role = row.original;
                return (
                    <div className="flex items-center">
                        <Switch
                            checked={role.active}
                            onCheckedChange={(checked) =>
                                onRemoveRole(membership.id, role.id, checked)
                            }
                        />
                        <span className="ml-2 text-xs">
                            {role.active ? "Active" : "Inactive"}
                        </span>
                    </div>
                );
            },
        },
    ];
    if (!membership) {
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

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Membership Information</CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditMembership}
                        >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                    </div>
                    <CardDescription>
                        Details about the {membership.name} membership plan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium">Name</h4>
                            <p className="text-sm">{membership.name}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium">
                                Price Per Month
                            </h4>
                            <p className="text-sm">
                                ${membership.pricePerMonth.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium">
                                Price Per Year
                            </h4>
                            <p className="text-sm">
                                ${membership.pricePerYear.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium">Status</h4>
                            <Badge
                                variant={
                                    membership.active ? "default" : "secondary"
                                }
                            >
                                {membership.active ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        {/* <div className="col-span-1 md:col-span-2">
                            <h4 className="text-sm font-medium">Features</h4>
                            <ul className="list-disc list-inside text-sm">
                                {membership.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div> */}
                        <div className="col-span-1 md:col-span-2">
                            <h4 className="text-sm font-medium">Created At</h4>
                            <p className="text-sm">
                                {formatDate(membership.createAt)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    <TabsTrigger value="roles">Roles</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="permissions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Direct Permissions</CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddPermissions}
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add
                                    Permissions
                                </Button>
                            </div>
                            <CardDescription>
                                Permissions directly assigned to this
                                membership. These are in addition to any
                                permissions granted by roles.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-medium">
                                    Permissions ({permissions.length})
                                </p>
                            </div>

                            {permissions.length > 0 ? (
                                <div className="space-y-4">
                                    <DataTable
                                        columns={permissionColumns}
                                        data={permissions}
                                        searchKey="permission"
                                        searchPlaceholder="Filter permissions..."
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-md">
                                    <p className="text-sm text-muted-foreground mb-2">
                                        No permissions assigned to this role
                                    </p>
                                    <Button
                                        size="sm"
                                        onClick={handleAddPermissions}
                                    >
                                        <PlusCircle className="mr-2 h-4 w-4" />{" "}
                                        Add Permissions
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Permissions Section */}

                {/* Roles Section */}
                <TabsContent value="roles" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Assigned Roles</CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddRoles}
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add Roles
                                </Button>
                            </div>
                            <CardDescription>
                                Roles assigned to this membership. Users with
                                this membership will have all permissions from
                                these roles.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-medium">
                                    Roles ({roles.length})
                                </p>
                            </div>

                            {roles.length > 0 ? (
                                <div className="space-y-4">
                                    <DataTable
                                        columns={roleColumns}
                                        data={roles}
                                        searchKey="roleName"
                                        searchPlaceholder="Filter roles..."
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-md">
                                    <p className="text-sm text-muted-foreground mb-2">
                                        No roles assigned to this membership
                                    </p>
                                    <Button size="sm" onClick={handleAddRoles}>
                                        <PlusCircle className="mr-2 h-4 w-4" />{" "}
                                        Add Roles
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
