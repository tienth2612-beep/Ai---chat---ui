"use client";

import { useMemberships } from "@/hooks/use-membership";
import { toast } from "sonner";
import { useEffect } from "react";
import { MembershipDetail } from "@/components/memberships/membership-detail";
import { useRbac } from "@/hooks/use-rbac";

export default function EditMembershipClient({ id }: { id: string }) {
    const { membership, getMembershipById } = useMemberships();
    const {
        permissionsOfPackage,
        rolesOfPackage,
        updatePackageRole,
        updateAssignOfPackage,
        getAssignOfPackage,
        getPackageRoles,
    } = useRbac();

    useEffect(() => {
        async function fetchMembership() {
            if (!id) return;
            try {
                const idNum = parseInt(id);
                await getMembershipById(id);
                await getPackageRoles(idNum);
                await getAssignOfPackage(idNum);
            } catch (error) {
                console.error("Error fetching membership:", error);
                toast.error("Failed to fetch membership details");
            }
        }
        fetchMembership();
    }, [id, getMembershipById, getPackageRoles, getAssignOfPackage]);

    const removePermissionFromMembership = async (
        membershipId: number,
        permissionId: number,
        active: boolean
    ) => {
        const success = await updateAssignOfPackage({
            id: permissionId,
            packageId: membershipId,
            active: active,
        });
        if (success) {
            await getAssignOfPackage(membershipId);
        }
        return success;
    };

    const removeRoleFromMembership = async (
        membershipId: number,
        roleId: number,
        active: boolean
    ) => {
        const success = await updatePackageRole({
            id: roleId,
            packageId: membershipId,
            active: active,
        });
        if (success) {
            await getPackageRoles(membershipId);
        }
        return success;
    };

    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Membership Details
                </h2>
            </div>
            <div className="grid gap-4">
                {membership && (
                    <MembershipDetail
                        id={parseInt(id)}
                        membership={membership}
                        onRemovePermission={removePermissionFromMembership}
                        onRemoveRole={removeRoleFromMembership}
                        permissions={permissionsOfPackage}
                        roles={rolesOfPackage}
                    />
                )}
            </div>
        </div>
    );
}