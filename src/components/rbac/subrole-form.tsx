"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SubroleFormProps {
    parentRoleId: number;
    parentLevel: number;
    onSuccess: () => void;
    onCancel: () => void;
}

const formSchema = z.object({
    roleName: z.string().min(2, {
        message: "Role name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    active: z.boolean(),
});

export function SubroleForm({
    parentRoleId,
    parentLevel,
    onSuccess,
    onCancel,
}: SubroleFormProps) {
    const { createRole, isLoading } = useRbac();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize the form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            roleName: "",
            description: "",
            active: true,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            // Create the subrole with parent information
            const subroleData = {
                roleName: values.roleName,
                description: values.description,
                parentId: parentRoleId,
                level: parentLevel + 1, // Subrole should be one level below parent
                active: values.active,
            };

            const result = await createRole(subroleData);

            if (result) {
                toast.success("Subrole created", {
                    description: "New subrole has been created successfully",
                });
                onSuccess();
            } else {
                toast.error("Error", {
                    description: "Failed to create subrole. Please try again.",
                });
            }
        } catch (error) {
            console.error("Create subrole error:", error);
            toast.error("Error", {
                description: "An unexpected error occurred. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="roleName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter subrole name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Enter a unique name for this subrole.
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
                                        placeholder="Enter subrole description"
                                        className="resize-none"
                                        rows={3}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Provide a brief description of this
                                    subrole's purpose and responsibilities.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="active"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                        Active Status
                                    </FormLabel>
                                    <FormDescription>
                                        Enable or disable this subrole.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                        <p>
                            <strong>Parent Role:</strong> Level {parentLevel}
                        </p>
                        <p>
                            <strong>This Subrole Level:</strong> Level{" "}
                            {parentLevel + 1}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting || isLoading}>
                        {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Create Subrole
                    </Button>
                </div>
            </form>
        </Form>
    );
}
