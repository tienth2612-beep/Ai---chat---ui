"use client";

import { MembershipPermissionsForm } from "@/components/memberships/membership-permissions-form";
import { Separator } from "@/components/ui/separator";
import { useRbac } from "@/hooks/use-rbac";
import { useMemberships } from "@/hooks/use-membership";
import { useEffect } from "react";
import { toast } from "sonner";

export default function MembershipPermissionsPageClient({
    id,
}: {
    id: string;
}) {
    const { getAssignOfPackage, permissionsOfPackage, createAssignOfPackage } =
        useRbac();
    const { getMembershipById, membership } = useMemberships();
    useEffect(() => {
        async function fetchData() {
            console.log(id);
            try {
                await getMembershipById(id);
                await getAssignOfPackage(Number(id));
            } catch (error) {
                console.error("Error fetching membership:", error);
                toast.error("Failed to fetch membership details");
            }
        }
        fetchData();
    }, [id, getMembershipById, getAssignOfPackage]);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">
                    Membership Extra Permissions
                </h3>
                <p className="text-sm text-muted-foreground">
                    Manage additional permissions for the {membership?.name}{" "}
                    membership.
                </p>
            </div>
            <Separator />
            <MembershipPermissionsForm
                membershipId={id}
                currentPermissions={
                    permissionsOfPackage?.map((permission) => permission.id) ||
                    []
                }
                onSave={async (permissions) => {
                    return await createAssignOfPackage(permissions);
                }}
            />
        </div>
    );
}
