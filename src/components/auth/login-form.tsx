"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
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
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters",
    }),
});

export function LoginForm() {
    const { login, googleLogin, isLoading, error } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const loginData: UserAuth.LoginRequest = {
            Email: values.email,
            Password: values.password,
        };
        const success = await login(loginData);

        if (success) {
            toast.success("Login successful", {
                description: "Redirecting to dashboard...",
            });
        } else {
            toast.error("Login failed", {
                description: error || "Invalid email or password",
            });
        }
    }

    const handleGoogleLogin = async () => {
        try {
            // Initialize Google Sign-In
            const google = window.google;
            if (!google) {
                toast.error("Google Sign-In is not available");
                return;
            }

            const client = google.accounts.oauth2.initTokenClient({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
                scope: "email profile",
                callback: async (response: any) => {
                    if (response.access_token) {
                        const success = await googleLogin(
                            response.access_token
                        );
                        if (success) {
                            toast.success("Google login successful", {
                                description: "Redirecting to dashboard...",
                            });
                        } else {
                            toast.error("Google login failed", {
                                description:
                                    error || "Failed to login with Google",
                            });
                        }
                    }
                },
            });

            client.requestAccessToken();
        } catch (error) {
            console.error("Google login error:", error);
            toast.error("Failed to initialize Google Sign-In");
        }
    };

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    {error && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="name@example.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
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
                    <div className="flex justify-end">
                        <Button variant="link" className="px-0 text-sm" asChild>
                            <Link href="/forgot-password">
                                Forgot password?
                            </Link>
                        </Button>
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>
            </Form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
            >
                <svg
                    className="mr-2 h-4 w-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                >
                    <path
                        fill="currentColor"
                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                </svg>
                {isLoading ? "Signing in..." : "Sign in with Google"}
            </Button>
        </div>
    );
}
