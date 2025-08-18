import { PermissionsTable } from "@/components/rbac/permissions-table";
import { Separator } from "@/components/ui/separator";

export default function PermissionsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Permissions Management</h3>
                <p className="text-sm text-muted-foreground">
                    Create, view, edit, and delete permissions in your system.
                </p>
            </div>
            <Separator />
            <PermissionsTable />
        </div>
    );
}
