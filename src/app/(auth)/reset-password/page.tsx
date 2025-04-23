"use client";

import Link from "next/link";
import { redirect } from "next/navigation";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { getCookie } from "@/lib/cookies";

export default function ResetPasswordPage() {
    // Check if there's an active reset session
    const resetSession = getCookie("reset_email");

    // If there's no active reset session, redirect to forgot password page
    if (!resetSession) {
        return redirect("/forgot-password");
    }

    return (
        <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center space-y-6">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Reset Password
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter the code sent to{" "}
                    <span className="font-medium">{resetSession}</span> and
                    create a new password
                </p>
            </div>
            <ResetPasswordForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
                <Link
                    href="/login"
                    className="hover:text-brand underline underline-offset-4"
                >
                    Back to login
                </Link>
            </p>
        </div>
    );
}
