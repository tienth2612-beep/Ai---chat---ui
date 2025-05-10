"use client";
import { MembershipAddRoles } from "@/components/memberships/membership-add-roles";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { useMemberships } from "@/hooks/use-membership";
import { useEffect } from "react";
import { useRbac } from "@/hooks/use-rbac";
export default function MembershipAddRolesPage() {
    const params = useParams();
    const { membership, isLoading, error, getMembershipById } =
        useMemberships();
    const { createPackageRole } = useRbac();

    useEffect(() => {
        getMembershipById(params.id as string);
    }, [getMembershipById, params.id]);

    const addRolesToMembership = async (
        membershipId: string,
        roles: number[]
    ) => {
        const success = await createPackageRole({
            packageId: parseInt(membershipId),
            roles: roles.map((role) => ({ roleId: role })),
        });
        return success;
    };
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Add Roles to Membership</h3>
                <p className="text-sm text-muted-foreground">
                    Select roles to add to the {membership?.name} membership.
                </p>
            </div>
            <Separator />
            {membership && (
                <MembershipAddRoles
                    membershipId={params.id as string}
                    membership={membership}
                    onAddRoles={addRolesToMembership}
                />
            )}
        </div>
    );
}
