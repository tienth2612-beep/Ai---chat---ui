"use client";

import { useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useCommonQuestions } from "@/hooks/use-common-questions";
import { toast } from "sonner";
import * as CommonQuestionModel from "@/types/commonQuestion";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().min(5, {
        message: "Description must be at least 5 characters.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

export interface GroupFormProps {
    group?: CommonQuestionModel.CommonGroupQuestionResponse;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function GroupForm({ group, onSuccess, onCancel }: GroupFormProps) {
    const { saveGroup, loading } = useCommonQuestions();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (group) {
            form.reset({
                name: group.name || "",
                description: group.description || "",
            });
        }
    }, [group, form]);

    const onSubmit = async (values: FormValues) => {
        try {
            await saveGroup(values, group?.id);
            toast.success(
                group
                    ? "Group updated successfully."
                    : "Group created successfully."
            );
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Group Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter group name"
                                    {...field}
                                />
                            </FormControl>
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
                                    placeholder="Enter group description"
                                    className="resize-none"
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
                        onClick={() => {
                            form.reset({ name: "", description: "" });
                            if (onCancel) onCancel();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : group ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
