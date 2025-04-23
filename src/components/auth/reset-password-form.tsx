"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as UserAuth from "@/types/auth";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { usePassword } from "@/hooks/use-password";
import { getCookie } from "@/lib/cookies";

const formSchema = z
    .object({
        otp: z.string().length(6, { message: "OTP must be 6 digits" }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export function ResetPasswordForm() {
    const {
        resetPassword,
        forgotPassword,
        isLoading,
        error: passwordError,
        success,
    } = usePassword();

    const [error, setError] = useState<string | null>(null);
    const [isResending, setIsResending] = useState(false);
    const resetSession = getCookie("reset_email");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const _resetPassword: Partial<UserAuth.ForgotPasswordRequest> = {
                NewPassword: values.password,
                OTP: values.otp,
            };
            const result = await resetPassword(_resetPassword);

            if (result) {
                toast.error("Password reset successful", {
                    description:
                        "Your password has been reset. You can now log in with your new password.",
                });
            } else {
                setError(passwordError || "Something went wrong");
                toast.error("Error", {
                    description: passwordError || "Something went wrong",
                });
            }
        } catch (error) {
            console.error("Reset password error:", error);
            setError("An unexpected error occurred. Please try again.");
            toast.error("Something went wrong", {
                description: "Please try again later",
            });
        }
    }

    async function handleResendOTP() {
        setIsResending(true);
        setError(null);

        try {
            const _email: UserAuth.RequestForgotPassword = {
                email: resetSession ?? "",
            };
            const result = await forgotPassword(_email);

            if (result) {
                toast.success("Code resent", {
                    description:
                        "We've sent you a new code to reset your password",
                });
            } else {
                setError(passwordError || "Failed to resend code");
                toast.error("Error", {
                    description: passwordError || "Failed to resend code",
                });
            }
        } catch (error) {
            console.error("Resend OTP error:", error);
            setError("An unexpected error occurred. Please try again.");
            toast.error("Something went wrong", {
                description: "Please try again later",
            });
        } finally {
            setIsResending(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
                        {success}
                    </div>
                )}
                <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Verification Code</FormLabel>
                            <FormControl>
                                <Input placeholder="123456" {...field} />
                            </FormControl>
                            <FormMessage />
                            <Button
                                type="button"
                                variant="link"
                                className="h-auto p-0 text-xs"
                                onClick={handleResendOTP}
                                disabled={isResending}
                            >
                                {isResending
                                    ? "Sending..."
                                    : "Didn't receive a code? Resend"}
                            </Button>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
            </form>
        </Form>
    );
}
