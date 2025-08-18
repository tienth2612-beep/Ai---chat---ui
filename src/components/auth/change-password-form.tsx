"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import * as UserAuth from "@/types/auth";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { usePassword } from "@/hooks/use-password";

const formSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, { message: "Current password is required" }),
        otp: z.string().length(6, { message: "OTP must be 6 digits" }),
        newPassword: z
            .string()
            .min(8, { message: "New password must be at least 8 characters" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: "New password must be different from current password",
        path: ["newPassword"],
    });

export function ChangePasswordForm() {
    const {
        resendResetOTP,
        changePassword,
        isLoading,
        error: passwordError,
    } = usePassword();
    const [step, setStep] = useState<"request" | "change">("request");
    const [isResending, setIsResending] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: "",
            otp: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    async function handleResendOTP() {
        setIsResending(true);

        try {
            const result = await resendResetOTP();

            if (result) {
                toast.success("New verification code sent", {
                    description:
                        "Please check your email for the new verification code",
                });
                setStep("change");
            } else {
                toast.error("Error", {
                    description:
                        passwordError || "Failed to resend verification code",
                });
            }
        } catch (error) {
            console.error("Resend OTP error:", error);
            toast.error("Something went wrong", {
                description: "Please try again later",
            });
        } finally {
            setIsResending(false);
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const data: UserAuth.ChangePasswordRequest = {
                NewPassword: values.newPassword,
                CurrentPassword: values.currentPassword,
                OTP: values.otp,
            };
            const result = await changePassword(data);

            if (result) {
                form.reset();
                setStep("request");
                toast.success("Password changed", {
                    description: "Your password has been changed successfully",
                });
            } else {
                toast.error("Error", {
                    description: passwordError || "Failed to change password",
                });
            }
        } catch (error) {
            console.error("Change password error:", error);
            toast.error("Something went wrong", {
                description: "Please try again later",
            });
        }
    }

    if (step === "request") {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                        To change your password, we will send a verification
                        code to your email address
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {success && (
                        <Alert className="mb-4">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )} */}
                    <p className="text-sm text-muted-foreground mb-4">
                        Click the button below to receive a verification code
                        via email. You wlll need this code to complete the
                        password change process.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Send Verification Code"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                    Enter the verification code and your new password
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {success && (
                    <Alert className="mb-4">
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )} */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
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
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="123456"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        <Button
                                            variant="link"
                                            type="button"
                                            className="h-auto p-0 text-xs"
                                            onClick={handleResendOTP}
                                            disabled={isResending}
                                        >
                                            {isResending
                                                ? "Sending..."
                                                : "Didn't receive a code? Resend"}
                                        </Button>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
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
                                    <FormLabel>Confirm New Password</FormLabel>
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
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setStep("request")}
                                disabled={isLoading}
                            >
                                Back
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Changing...
                                    </>
                                ) : (
                                    "Change Password"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
