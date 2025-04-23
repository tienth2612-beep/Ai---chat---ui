"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
});

export function ForgotPasswordForm() {
    const { forgotPassword, isLoading, error: passwordError } = usePassword();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setError(null);
        try {
            const result = await forgotPassword(values);

            if (result) {
                toast.success("Check your email", {
                    description: "We've sent you a code to reset your password",
                });

                // Redirect to reset password page
                router.push("/reset-password");
            } else {
                setError(passwordError || "Something went wrong");
                toast.error(passwordError || "Something went wrong");
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            setError("An unexpected error occurred. Please try again.");
            toast.error("Something went wrong", {
                description: "Please try again later",
            });
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Code"}
                </Button>
            </form>
        </Form>
    );
}
