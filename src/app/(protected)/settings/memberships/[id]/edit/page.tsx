"use client";

import { notFound, useParams } from "next/navigation";
import { MembershipForm } from "@/components/memberships/membership-form";
import { useMemberships } from "@/hooks/use-membership";
import { toast } from "sonner";
import { useEffect } from "react";
export default function EditMembershipPage() {
    const params = useParams();
    const { membership, getMembershipById } = useMemberships();

    useEffect(() => {
        async function fetchMembership() {
            try {
                await getMembershipById(params.id as string);
            } catch (error) {
                console.error("Error fetching membership:", error);
                toast.error("Failed to fetch membership details");
            }
        }

        fetchMembership();
    }, [params.id, getMembershipById]);

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
