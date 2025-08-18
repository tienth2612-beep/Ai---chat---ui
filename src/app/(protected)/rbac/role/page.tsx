import { RolesTable } from "@/components/rbac/roles-table";
import { Separator } from "@/components/ui/separator";

export default function RolesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Roles Management</h3>
                <p className="text-sm text-muted-foreground">
                    Manage roles and their associated permissions.
                </p>
            </div>
            <Separator />
            <RolesTable />
        </div>
    );
}
