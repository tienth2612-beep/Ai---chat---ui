import { RoleForm } from "@/components/rbac/role-form";
import { Separator } from "@/components/ui/separator";

export default function CreateRolePage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Create Role</h3>
                <p className="text-sm text-muted-foreground">
                    Create a new role and assign permissions to it.
                </p>
            </div>
            <Separator />
            <RoleForm />
        </div>
    );
}
