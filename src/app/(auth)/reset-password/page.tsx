"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/cookies";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthBackground } from "@/components/auth/auth-background";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [resetEmail, setResetEmail] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Chỉ kiểm tra cookie reset_email (được tạo ra khi bấm gửi ở trang Forgot)
        const email = getCookie("reset_email");

        if (!email) {
            // Nếu chưa nhập email ở bước trước, không cho ở đây, đẩy về lại bước đầu
            router.replace("/forgot-password");
        } else {
            setResetEmail(email);
            setIsChecking(false);
        }
    }, [router]);

    if (isChecking) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#00A3FF]" />
            </div>
        );
    }

    return (
        <AuthBackground>
            <div className="w-full max-w-[480px] mx-auto bg-white rounded-[32px] px-8 py-10 shadow-2xl shadow-blue-900/20">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Create New Password</h1>
                    <p className="text-sm text-slate-500 mt-2">
                        Resetting password for: <span className="font-bold">{resetEmail}</span>
                    </p>
                </div>

                <ResetPasswordForm />
            </div>
        </AuthBackground>
    );
}