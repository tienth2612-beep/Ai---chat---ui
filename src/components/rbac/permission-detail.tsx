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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import * as RbacModel from "@/types/rbac";

interface PermissionDetailProps {
    id: string;
}

export function PermissionDetail({ id }: PermissionDetailProps) {
    const router = useRouter();
    const { getPermission, isLoading, error, permission } = useRbac();

    useEffect(() => {
        const fetchPermission = async () => {
            await getPermission(Number(id));
        };

        fetchPermission();
    }, [id, getPermission]);

    const handleBack = () => {
        router.push("/user-management/rbac/permissions");
    };

    const handleEdit = () => {
        router.push(`/user-management/rbac/permissions/${id}/edit`);
    };

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

    if (!permission) {
        return <div>Permission not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Permissions
                </Button>
                <Button size="sm" onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Permission
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{permission.permission}</CardTitle>
                    <CardDescription>{permission.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">ID</p>
                            <p className="text-sm font-medium">
                                {permission.id}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Created At
                            </p>
                            <p className="text-sm font-medium">
                                {formatDate(permission.createAt)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Permission
                            </p>
                            <Badge
                                variant="outline"
                                className="font-mono text-xs mt-1"
                            >
                                {permission.permission}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
