import { RoleDetail } from "@/components/rbac/role-detail";
import { Separator } from "@/components/ui/separator";

export default function RoleDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Role Details</h3>
                <p className="text-sm text-muted-foreground">
                    View role information and assigned permissions.
                </p>
            </div>
            <Separator />
            <RoleDetail id={params.id} />
        </div>
    );
}
