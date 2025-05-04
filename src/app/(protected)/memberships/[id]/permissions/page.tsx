"use client";
import { MembershipPermissionsForm } from "@/components/rbac/membership-permissions-form";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { useRbac } from "@/hooks/use-rbac";
import { useMemberships } from "@/hooks/use-membership";
import { useState, useEffect } from "react";
import * as RbacModel from "@/types/rbac";

export default function MembershipPermissionsPage() {
    const { id } = useParams();
    const { getAssignOfPackage, permissionsOfPackage, createAssignOfPackage } =
        useRbac();
    const { getMembershipById, membership } = useMemberships();
    useEffect(() => {
        const fetchMembership = async () => {
            await getMembershipById(id as string);
        };
        const fetchAssignOfPackage = async () => {
            await getAssignOfPackage(Number(id), {});
        };
        fetchMembership();
        fetchAssignOfPackage();
    }, [id, getMembershipById, getAssignOfPackage]);

    if (!membership) {
        return <div>Membership not found</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">
                    Membership Extra Permissions
                </h3>
                <p className="text-sm text-muted-foreground">
                    Manage additional permissions for the {membership.name}{" "}
                    membership.
                </p>
            </div>
            <Separator />
            <MembershipPermissionsForm
                membershipId={id as string}
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
