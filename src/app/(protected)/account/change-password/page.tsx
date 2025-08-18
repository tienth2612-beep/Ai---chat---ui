"use client";
import { ChangePasswordForm } from "@/components/auth/change-password-form";

export default function ChangePasswordPage() {
    // Add your client-side logic here
    return (
        <div className="mx-auto max-w-md space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Change Password
                </h1>
                <p className="text-muted-foreground">
                    Update your account password
                </p>
            </div>
            <ChangePasswordForm />
        </div>
    );
}
