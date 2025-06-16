import { AuthUserForm } from "@/components/auth-users/auth-user-form";

interface EditAuthUserPageProps {
    params: {
        id: string;
    };
}

export default function EditAuthUserPage({ params }: EditAuthUserPageProps) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Edit User</h3>
                <p className="text-sm text-muted-foreground">
                    Update user information.
                </p>
            </div>
            <AuthUserForm userId={Number(params.id)} />
        </div>
    );
}
