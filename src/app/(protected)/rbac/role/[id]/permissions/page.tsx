import { RolePermissionsForm } from "@/components/rbac/role-permissions-form";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";

export default function AssignPermissionsPage() {
    const { id } = useParams();
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Assign Permissions</h3>
                <p className="text-sm text-muted-foreground">
                    Select the permissions to assign to this role.
                </p>
            </div>
            <Separator />
            <RolePermissionsForm roleId={id as string} />
        </div>
    );
}
