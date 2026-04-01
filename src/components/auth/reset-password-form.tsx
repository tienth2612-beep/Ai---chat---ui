"use client";

import { useState, useEffect } from "react";
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
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { usePassword } from "@/hooks/use-password";
import { getCookie } from "@/lib/cookies";
import { Eye, EyeOff, X, Check } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
    otp: z.string().length(6, { message: "OTP must be 6 digits" }),
    password: z.string().min(8, { message: "Password is too short" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export function ResetPasswordForm() {
    const { resetPassword, isLoading, error: passwordError } = usePassword();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [timer, setTimer] = useState(60);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { otp: "", password: "", confirmPassword: "" },
    });

    const watchPassword = form.watch("password", "");

    const requirements = [
        { label: "At least 8 characters", met: watchPassword.length >= 8 },
        { label: "Contains an uppercase letter", met: /[A-Z]/.test(watchPassword) },
        { label: "Contains a number", met: /[0-9]/.test(watchPassword) },
        { label: "Contains a symbol !@#$%^&*()_+-=;:,.?~", met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(watchPassword) },
    ];

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer((t) => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const _resetPassword: Partial<UserAuth.ForgotPasswordRequest> = {
            NewPassword: values.password,
            OTP: values.otp,
        };
        const result = await resetPassword(_resetPassword);
        if (result) {
            toast.success("Password reset successful");
        } else {
            toast.error(passwordError || "Something went wrong");
        }
    }

    return (
        <div className="mx-auto max-w-[450px] space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* 1. Verification Code */}
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold">Verification code</FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                                            <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                                            <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                                        </InputOTPGroup>
                                        <InputOTPSeparator className="mx-2 font-bold text-xl">—</InputOTPSeparator>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                                            <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                                            <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* 2. New Password */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold">New password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your new password"
                                            className="pr-10 h-11 rounded-2xl"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* 3. Password Requirements List (Đặt ở đây) */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Password must have:</p>
                        <ul className="space-y-1.5">
                            {requirements.map((req, index) => (
                                <li key={index} className={`flex items-center text-sm ${req.met ? "text-green-600 font-medium" : "text-gray-500"}`}>
                                    {req.met ? <Check size={16} className="mr-2" /> : <X size={16} className="mr-2 text-gray-400" />}
                                    {req.label}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 4. Confirm Password (Dời xuống dưới các dòng chữ) */}
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold">Confirm Password*</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            className="pr-10 h-11 rounded-2xl"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* 5. Submit Button */}
                    <Button type="submit" className="w-full h-12 bg-[#0ea5e9] hover:bg-blue-600 text-white font-bold rounded-lg" disabled={isLoading}>
                        {isLoading ? "Resetting..." : "Reset password"}
                    </Button>

                    <div className="text-center space-y-4">
                        <div className="text-sm text-gray-600">
                            <p>Didn&apos;t receive the code?</p>
                            <p className={`font-semibold ${timer > 0 ? "text-gray-400" : "text-blue-500 cursor-pointer"}`}>
                                {timer > 0 ? `Resend in ${timer}s` : "Resend now"}
                            </p>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">
                            Remember your password? <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
                        </p>
                    </div>
                </form>
            </Form>
        </div>
    );
}