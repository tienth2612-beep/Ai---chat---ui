"use client";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import * as RbacModel from "@/types/rbac";
import { permission } from "process";

interface PermissionFormProps {
    permission?: RbacModel.PermissionResponse;
    isEditing?: boolean;
}

const formSchema = z.object({
    permission: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    code: z
        .string()
        .min(3, {
            message: "Code must be at least 3 characters.",
        })
        .regex(/^[a-z]+:[a-z]+$/, {
            message:
                "Code must be in format 'category:action' (e.g., users:create).",
        }),
});

export function PermissionForm({
    permission,
    isEditing = false,
}: PermissionFormProps) {
    const router = useRouter();
    const { createPermission, updatePermission, isLoading } = useRbac();

    // Initialize the form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            permission: permission?.permission || "",
            description: permission?.description || "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (isEditing && permission) {
                const updatedPermission = await updatePermission({
                    id: permission.id,
                    permission: values.permission,
                    description: values.description,
                    active: true,
                });
                if (updatedPermission) {
                    toast.success("Permission updated", {
                        description: "Permission has been updated successfully",
                    });
                    router.push("/user-management/rbac/permissions");
                }
            } else {
                const newPermission = await createPermission(values);
                if (newPermission) {
                    toast.success("Permission created", {
                        description:
                            "New permission has been created successfully",
                    });
                    router.push("/user-management/rbac/permissions");
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
                onClick={() => router.push("/user-management/rbac/permissions")}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Permissions
            </Button>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {isEditing
                                    ? "Edit Permission"
                                    : "Create Permission"}
                            </CardTitle>
                            <CardDescription>
                                {isEditing
                                    ? "Update the permission details below."
                                    : "Fill in the details to create a new permission."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="permission"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter permission name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The display name of the permission.
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
                                                placeholder="Enter permission description"
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            A brief description of what this
                                            permission allows.
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
                                ? "Update Permission"
                                : "Create Permission"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                router.push("/user-management/rbac/permissions")
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
