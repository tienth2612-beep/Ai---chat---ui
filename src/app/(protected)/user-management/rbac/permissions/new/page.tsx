import { PermissionForm } from "@/components/rbac/permission-form";
import { Separator } from "@/components/ui/separator";

export default function CreatePermissionPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Create Permission</h3>
                <p className="text-sm text-muted-foreground">
                    Create a new permission in the system.
                </p>
            </div>
            <Separator />
            <PermissionForm />
        </div>
    );
}
