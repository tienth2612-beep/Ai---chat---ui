import { PermissionDetail } from "@/components/rbac/permission-detail";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";

export default function PermissionDetailPage() {
    const { id } = useParams();
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Permission Details</h3>
                <p className="text-sm text-muted-foreground">
                    View detailed information about this permission.
                </p>
            </div>
            <Separator />
            <PermissionDetail id={id as string} />
        </div>
    );
}
