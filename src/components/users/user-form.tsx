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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useUsers } from "@/hooks/use-users";
import type { User } from "@/types/user";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    role: z.enum(["user", "admin", "manager"]),
    membership: z.enum(["none", "basic", "premium", "enterprise"]),
    status: z.enum(["active", "inactive"]),
});

interface UserFormProps {
    user?: User;
    isEditing?: boolean;
}
export function UserForm({ user, isEditing = false }: UserFormProps) {
    const router = useRouter();
    const { isLoading, error } = useUsers();
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            role: (user?.role as any) || "user",
            membership: (user?.membership as any) || "none",
            status: (user?.status as any) || "active",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setFormError(null);

        try {
            if (isEditing && user) {
                const updatedUser = await updateUser(user.id, values);
                if (updatedUser) {
                    toast.success("User updated", {
                        description: "User has been updated successfully",
                    });
                    router.push("/users");
                    router.refresh();
                } else {
                    setFormError(error || "Failed to update user");
                    toast.error("Error", {
                        description: error || "Failed to update user",
                    });
                }
            } else {
                const newUser = await createUser(values);
                if (newUser) {
                    toast("User created", {
                        description: "New user has been created successfully",
                    });
                    router.push("/users");
                    router.refresh();
                } else {
                    setFormError(error || "Failed to create user");
                    toast.error("Error", {
                        description: error || "Failed to create user",
                    });
                }
            }
        } catch (err) {
            console.error("User form error:", err);
            setFormError("An unexpected error occurred. Please try again.");
            toast.error("Error", {
                description: "Something went wrong. Please try again.",
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="john@example.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="user">
                                            User
                                        </SelectItem>
                                        <SelectItem value="admin">
                                            Admin
                                        </SelectItem>
                                        <SelectItem value="manager">
                                            Manager
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="membership"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Membership</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a membership" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            None
                                        </SelectItem>
                                        <SelectItem value="basic">
                                            Basic
                                        </SelectItem>
                                        <SelectItem value="premium">
                                            Premium
                                        </SelectItem>
                                        <SelectItem value="enterprise">
                                            Enterprise
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="inactive">
                                            Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex gap-2">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading
                            ? "Saving..."
                            : isEditing
                            ? "Update User"
                            : "Create User"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/users")}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
