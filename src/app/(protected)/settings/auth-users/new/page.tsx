import { AuthUserForm } from "@/components/auth-users/auth-user-form";

export default function NewAuthUserPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Invite New User</h3>
                <p className="text-sm text-muted-foreground">
                    Send an invitation to a new user to join the system.
                </p>
            </div>
            <AuthUserForm />
        </div>
    );
}
