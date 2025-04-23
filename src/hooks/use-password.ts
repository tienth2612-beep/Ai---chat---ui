"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/service/auth.service";
import { getCookie, setCookie } from "@/lib/cookies";
import * as UserAuth from "@/types/auth";
import { eraseCookie } from "@/lib/client-cookies";

// Hook
export function usePassword() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Forgot Password - Request OTP
    const forgotPassword = useCallback(
        async (credentials: UserAuth.RequestForgotPassword) => {
            setIsLoading(true);
            setError(null);
            setSuccess(null);
            try {
                const response = await authService.ForgotPasswordOTP(
                    credentials
                );

                if (response.isSuccess) {
                    // Store email in cookie for the reset flow
                    setCookie("reset_email", credentials.email, 1); // 1 day

                    setSuccess("Verification code sent to your email");

                    // Redirect to reset password page
                    router.push("/reset-password");
                    return true;
                } else {
                    setError(
                        response.message || "Failed to send verification code"
                    );
                    return false;
                }
            } catch (error: any) {
                console.log(error);
                if (error.response) {
                    // Lấy data từ backend trả về
                    console.error("API Error Response:", error.response.data);
                    setError(
                        error.response.data ||
                            "An unexpected error occurred. Please try again."
                    );
                } else {
                    //console.error("Other Error:", error.message);
                }
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [router]
    );

    // Reset Password
    const resetPassword = useCallback(
        async (credentials: Partial<UserAuth.ForgotPasswordRequest>) => {
            setIsLoading(true);
            setError(null);
            setSuccess(null);

            try {
                credentials.Email = getCookie("reset_email") ?? "";
                const response = await authService.ForgotPassword(credentials);

                if (response.isSuccess) {
                    // Clear reset email cookie
                    eraseCookie("reset_email");

                    setSuccess("Your password has been reset successfully");

                    // Redirect to login page
                    router.push("/login");
                    return true;
                } else {
                    setError(response.message || "Failed to reset password");
                    return false;
                }
            } catch (error) {
                console.error("Reset password error:", error);
                setError("An unexpected error occurred. Please try again.");
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [router]
    );

    // Resend OTP for Reset Password
    const resendResetOTP = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await authService.ResentPasswordOTP();

            if (response.isSuccess) {
                setSuccess("New verification code sent to your email");
                return true;
            } else {
                setError(
                    response.message || "Failed to resend verification code"
                );
                return false;
            }
        } catch (error) {
            console.error("Resend OTP error:", error);
            setError("An unexpected error occurred. Please try again.");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Change Password
    const changePassword = useCallback(
        async (credentials: UserAuth.ChangePasswordRequest) => {
            setIsLoading(true);
            setError(null);
            setSuccess(null);

            try {
                const response = await authService.ChangePassword(credentials);

                if (response.isSuccess) {
                    setSuccess("Your password has been changed successfully");
                    return true;
                } else {
                    setError(response.message || "Failed to change password");
                    return false;
                }
            } catch (error) {
                console.error("Change password error:", error);
                setError("An unexpected error occurred. Please try again.");
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return {
        isLoading,
        error,
        success,
        forgotPassword,
        resetPassword,
        resendResetOTP,
        changePassword,
    };
}
