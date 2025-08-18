"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRbac } from "@/hooks/use-rbac";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import * as RbacModel from "@/types/rbac";

interface RoleFormProps {
    role?: RbacModel.RoleResponse;
    isEditing?: boolean;
}

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().optional(),
});

export function RoleForm({ role, isEditing = false }: RoleFormProps) {
    const router = useRouter();
    const { createRole, updateRole, isLoading } = useRbac();

    // Initialize the form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: role?.roleName || "",
            description: role?.description || "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (isEditing && role) {
                const updatedRole = await updateRole({
                    id: role.id,
                    roleName: values.name,
                    description: values.description,
                });
                if (updatedRole) {
                    toast.success("Role updated", {
                        description: "Role has been updated successfully",
                    });
                    router.push("/user-management/rbac/roles");
                }
            } else {
                const newRole = await createRole({
                    roleName: values.name,
                    description: values.description,
                });
                if (newRole) {
                    toast.success("Role created", {
                        description: "New role has been created successfully",
                    });
                    router.push("/user-management/rbac/roles");
                }
            }
        } catch (error) {
            toast.error("Error", {
                description: "An error occurred. Please try again.",
            });
        }
    }

    return (
        <div className="space-y-6">
            <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/user-management/rbac/roles")}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Roles
            </Button>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                            <CardDescription>
                                Enter the basic information for the role.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter role name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The name of the role as it will
                                            appear in the system.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter role description"
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            A brief description of the role and
                                            its purpose.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading
                                ? "Saving..."
                                : isEditing
                                ? "Update Role"
                                : "Create Role"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                router.push("/user-management/rbac/roles")
                            }
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
