"use client";

import { PermissionForm } from "@/components/rbac/permission-form";
import { Separator } from "@/components/ui/separator";
import { useRbac } from "@/hooks/use-rbac";
import { useEffect } from "react";

export default function EditPermissionPageClient({ id }: { id: string }) {
    const { getPermission, permission } = useRbac();
    useEffect(() => {
        const fetchPermission = async () => {
            await getPermission(Number(id));
        };
        fetchPermission();
    }, [getPermission, id]);

    if (!permission) {
        return <div>Permission not found</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Edit Permission</h3>
                <p className="text-sm text-muted-foreground">
                    Edit permission details.
                </p>
            </div>
            <Separator />
            <PermissionForm permission={permission} isEditing={true} />
        </div>
    );
}
