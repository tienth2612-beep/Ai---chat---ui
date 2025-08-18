"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import * as MembershipModel from "@/types/membership";
import { useMemberships } from "@/hooks/use-membership";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    pricePerMonth: z.coerce.number().min(0, {
        message: "Price must be a positive number.",
    }),
    pricePerYear: z.coerce.number().min(0, {
        message: "Price must be a positive number.",
    }),
});

export function MembershipForm({
    membership,
    isEditing,
}: {
    membership?: MembershipModel.PackageResponse | null;
    isEditing?: boolean;
}) {
    console.log(membership);
    const router = useRouter();
    const { createMembership, updateMembership, isLoading, error } =
        useMemberships();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: membership?.name ?? "",
            pricePerMonth: membership?.pricePerMonth ?? 0,
            pricePerYear: membership?.pricePerYear ?? 0,
        },
    });
    useEffect(() => {
        if (membership) {
            form.reset({
                name: membership?.name ?? "",
                pricePerMonth: membership?.pricePerMonth ?? 0,
                pricePerYear: membership?.pricePerYear ?? 0,
            });
        }
    }, [membership, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (isEditing && membership) {
                const requestUpdateMembership: MembershipModel.CreateUpdatePackageRequest =
                    {
                        id: membership.id,
                        ...values,
                    };
                const response = await updateMembership(
                    membership.id.toString(),
                    requestUpdateMembership
                );
                if (response) {
                    toast.success("Membership updated");
                } else {
                    toast.error(
                        error || "Something went wrong. Please try again."
                    );
                }
            } else {
                const membershipData: MembershipModel.CreateUpdatePackageRequest =
                    {
                        id: 0,
                        ...values,
                    };
                const response = await createMembership(membershipData);
                if (response) {
                    toast.success("Membership created");
                } else {
                    toast.error(
                        error || "Something went wrong. Please try again."
                    );
                }
            }
            router.push("/settings/memberships");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    }
    const handleManagePermissions = () => {
        if (membership) {
            router.push(`/settings/memberships/${membership.id}/permissions`);
        }
    };
    const handleManageRoles = () => {
        if (membership) {
            router.push(`/settings/memberships/${membership.id}/roles`);
        }
    };
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
                                <Input placeholder="Basic Plan" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="pricePerMonth"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price Per Month</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="99.99"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="pricePerYear"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price Per Year</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="99.99"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-2">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading
                            ? "Saving..."
                            : isEditing
                            ? "Update Membership"
                            : "Create Membership"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/settings/memberships")}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
