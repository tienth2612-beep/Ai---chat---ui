import { AuthUserForm } from "@/components/auth-users/auth-user-form";

/** Placeholder so `output: 'export'` has ≥1 prerender path; real IDs load client-side. */
export function generateStaticParams() {
    return [{ id: "0" }];
}

export default function EditAuthUserPage({
    params,
}: {
    params: { id: string };
}) {
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
