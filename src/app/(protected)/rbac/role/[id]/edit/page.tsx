import { RoleForm } from "@/components/rbac/role-form";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { useRbac } from "@/hooks/use-rbac";

export default async function EditRolePage() {
    var params = useParams();
    const { getRole } = useRbac();
    const role = await getRole(Number(params.id));

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
