"use client";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthBackground } from "@/components/auth/auth-background"; 

export default function ForgotPasswordPage() {
    // Không thêm bất kỳ div hay h1 nào ở đây nữa
    // Vì tất cả đã có sẵn bên trong ForgotPasswordForm rồi
    return (
        <AuthBackground>
            <ForgotPasswordForm />
        </AuthBackground>
    );
}