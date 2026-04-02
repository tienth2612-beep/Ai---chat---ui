"use client";

import { RoleForm } from "@/components/rbac/role-form";
import { Separator } from "@/components/ui/separator";
import { useRbac } from "@/hooks/use-rbac";
import { useEffect } from "react";

export default function EditRolePageClient({ id }: { id: string }) {
    const { getRole, role } = useRbac();
    useEffect(() => {
        const fetchRole = async () => {
            await getRole(Number(id));
        };
        fetchRole();
    }, [getRole, id]);

    if (!role) {
        return <div>Role not found</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Edit Role</h3>
                <p className="text-sm text-muted-foreground">
                    Edit role details and assigned permissions.
                </p>
            </div>
            <Separator />
            <RoleForm role={role} isEditing={true} />
        </div>
    );
}
