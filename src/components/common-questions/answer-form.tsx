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
import { useCommonQuestions } from "@/hooks/use-common-questions";
import { toast } from "sonner";
import * as CommonQuestionModel from "@/types/commonQuestion";

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    code: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export interface AnswerFormProps {
    questionId: number;
    answer?: CommonQuestionModel.AnswerResponse;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function AnswerForm({
    questionId,
    answer,
    onSuccess,
    onCancel,
}: AnswerFormProps) {
    const { saveAnswer, loading } = useCommonQuestions();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            code: "",
        },
    });

    useEffect(() => {
        if (answer) {
            form.reset({
                title: answer.title || "",
                code: answer.code || "",
            });
        }
    }, [answer, form]);

    const onSubmit = async (values: FormValues) => {
        try {
            await saveAnswer(
                questionId,
                {
                    questionId,
                    ...values,
                    code: values.code || null,
                    status: 1, // Default active status
                },
                answer?.id
            );
            toast.success(
                answer
                    ? "Answer updated successfully."
                    : "Answer created successfully."
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
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Answer Text</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter answer text"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter code (optional)"
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
                            form.reset({ title: "", code: "" });
                            if (onCancel) onCancel();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : answer ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
