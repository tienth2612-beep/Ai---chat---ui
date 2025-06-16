"use client";

import { useEffect } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuthUser } from "@/hooks/use-auth-user";
import { toast } from "sonner";

const formSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        })
        .optional(),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z
        .string()
        .min(10, {
            message: "Please enter a valid phone number.",
        })
        .optional(),
    address: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AuthUserFormProps {
    userId?: number;
}

export function AuthUserForm({ userId }: AuthUserFormProps) {
    const router = useRouter();
    const {
        user,
        isLoading,
        error,
        getAuthUser,
        createAuthUser,
        updateAuthUser,
        inviteAuthUser,
    } = useAuthUser();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
        },
    });

    useEffect(() => {
        if (userId) {
            getAuthUser(userId);
        }
    }, [userId, getAuthUser]);

    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name ?? "",
                email: user.email ?? "",
                phone: user.phone ?? "",
                address: user.address ?? "",
            });
        }
    }, [user, form]);

    const onSubmit = async (values: FormValues) => {
        try {
            if (userId) {
                await updateAuthUser(userId, values);
                toast.success("User updated successfully.");
            } else {
                // For new invitations, only send email
                await inviteAuthUser({ email: values.email });
                toast.success("Invitation sent successfully.");
            }
            router.push("/settings/auth-users");
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {userId && (
                    <>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter phone number"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter address"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter email"
                                    type="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">
                        {userId ? "Update" : "Send Invitation"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
