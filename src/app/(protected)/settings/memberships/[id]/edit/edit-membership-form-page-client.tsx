"use client";

import { MembershipForm } from "@/components/memberships/membership-form";
import { useMemberships } from "@/hooks/use-membership";
import { toast } from "sonner";
import { useEffect } from "react";

export default function EditMembershipFormPageClient({
    id,
}: {
    id: string;
}) {
    const { membership, getMembershipById } = useMemberships();

    useEffect(() => {
        async function fetchMembership() {
            try {
                await getMembershipById(id);
            } catch (error) {
                console.error("Error fetching membership:", error);
                toast.error("Failed to fetch membership details");
            }
        }

        fetchMembership();
    }, [id, getMembershipById]);

    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Membership Details
                </h2>
            </div>
            <div className="grid gap-4">
                <MembershipForm membership={membership} isEditing />
            </div>
        </div>
    );
}
