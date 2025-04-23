import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth/register-form";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
    title: "Register",
    description: "Create a new account",
};

export default async function RegisterPage() {
    // Get the session
    const session = await getSession();

    // If we have a session, redirect to dashboard
    if (session) {
        return redirect("/dashboard");
    }

    // If no session, show the register page
    return (
        <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center space-y-6">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Create an account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your details to create a new account
                </p>
            </div>
            <RegisterForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
                <Link
                    href="/login"
                    className="hover:text-brand underline underline-offset-4"
                >
                    Already have an account? Sign in
                </Link>
            </p>
        </div>
    );
}
