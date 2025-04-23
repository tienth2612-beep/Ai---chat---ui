"use client";

import Link from "next/link";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { getCookie } from "@/lib/cookies";
import { redirect } from "next/navigation";

// export const metadata: Metadata = {
//     title: "Forgot Password",
//     description: "Reset your password",
// };

export default function ForgotPasswordPage() {
    const token = getCookie("session");
    // If there's an active reset session, redirect to reset password page
    if (token) {
        return redirect("/reset-password");
    }
    return (
        <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center space-y-6">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Forgot Password
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email address and we will send you a code to
                    reset your password
                </p>
            </div>
            <ForgotPasswordForm />
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
