"use client";

import { useEffect, forwardRef, useImperativeHandle } from "react";
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
import { useCommonQuestions } from "@/hooks/use-common-questions";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { COMMON_QUESTION_TYPE } from "@/lib/constants";

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    code: z.string().optional(),
    type: z.number().min(0, {
        message: "Please select a type.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

export interface CommonQuestionFormProps {
    groupId: number;
    questionId?: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const CommonQuestionForm = forwardRef(function CommonQuestionForm(
    { groupId, questionId, onSuccess, onCancel }: CommonQuestionFormProps,
    ref
) {
    const router = useRouter();
    const {
        questionDetail,
        loading,
        error,
        fetchQuestionDetail,
        saveQuestion,
    } = useCommonQuestions();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            code: "",
            type: COMMON_QUESTION_TYPE.SINGLE_CHOICE,
        },
    });

    useImperativeHandle(ref, () => ({
        reset: () =>
            form.reset({
                title: "",
                code: "",
                type: COMMON_QUESTION_TYPE.SINGLE_CHOICE,
            }),
    }));

    useEffect(() => {
        if (questionId) {
            fetchQuestionDetail(questionId);
        }
    }, [questionId, fetchQuestionDetail]);

    useEffect(() => {
        if (questionId && questionDetail && questionDetail.question) {
            form.reset({
                title: questionDetail.question.title || "",
                code: questionDetail.question.code || "",
                type: questionDetail.question.type,
            });
        }
    }, [questionId, questionDetail, form]);

    const onSubmit = async (values: FormValues) => {
        try {
            await saveQuestion(
                groupId,
                {
                    ...values,
                    status: 1, // Default active status
                },
                questionId
            );
            toast.success(
                questionId
                    ? "Question updated successfully."
                    : "Question created successfully."
            );
            if (onSuccess) onSuccess();
            router.push(`/settings/common-questions/groups/${groupId}`);
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter title" {...field} />
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
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) =>
                                        field.onChange(Number(value))
                                    }
                                    value={field.value?.toString()}
                                >
                                    <FormItem>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem
                                                value={COMMON_QUESTION_TYPE.SINGLE_CHOICE.toString()}
                                            >
                                                Single Choice
                                            </SelectItem>
                                            <SelectItem
                                                value={COMMON_QUESTION_TYPE.MULTIPLE_CHOICE.toString()}
                                            >
                                                Multiple Choice
                                            </SelectItem>
                                        </SelectContent>
                                    </FormItem>
                                </Select>
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
                            form.reset({ title: "", code: "", type: 1 });
                            if (onCancel) onCancel();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading
                            ? "Saving..."
                            : questionId
                            ? "Update"
                            : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    );
});
