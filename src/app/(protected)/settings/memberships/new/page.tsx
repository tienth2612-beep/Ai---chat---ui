import { MembershipForm } from "@/components/memberships/membership-form";

export default function NewMembershipPage() {
    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Create Membership
                </h2>
            </div>
            <div className="grid gap-4">
                <MembershipForm />
            </div>
        </div>
    );
}
