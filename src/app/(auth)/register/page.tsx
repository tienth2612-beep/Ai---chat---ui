"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { useAuth } from "@/hooks/use-auth";
import { AuthBackground } from "@/components/auth/auth-background";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            router.push("/dashboard");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" />
            </div>
        );
    }

    return (
        <AuthBackground>
            <RegisterForm />
        </AuthBackground>
    );
}