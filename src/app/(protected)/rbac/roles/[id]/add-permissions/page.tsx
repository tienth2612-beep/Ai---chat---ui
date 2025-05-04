"use client";

import { RoleAddPermissions } from "@/components/rbac/role-add-permissions";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
export default function AddPermissionsPage() {
    const { id } = useParams();
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Add Permissions to Role</h3>
                <p className="text-sm text-muted-foreground">
                    Select permissions to add to this role.
                </p>
            </div>
            <Separator />
            <RoleAddPermissions roleId={id as string} />
        </div>
    );
}
