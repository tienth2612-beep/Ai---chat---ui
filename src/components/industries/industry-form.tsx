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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useIndustry } from "@/hooks/use-industry";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface IndustryFormProps {
    industryId?: number;
}

export function IndustryForm({ industryId }: IndustryFormProps) {
    const router = useRouter();
    const {
        industry,
        isLoading,
        error,
        getIndustryById,
        createIndustry,
        updateIndustry,
    } = useIndustry();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        if (industryId) {
            getIndustryById(industryId.toString());
        }
    }, [industryId, getIndustryById]);

    useEffect(() => {
        if (industry) {
            form.reset({
                name: industry.name,
            });
        }
    }, [industry, form]);

    const onSubmit = async (values: FormValues) => {
        try {
            if (industryId) {
                await updateIndustry(industryId.toString(), values);
                error
                    ? toast.error("Something went wrong. Please try again.")
                    : toast.success("Industry updated successfully.");
            } else {
                await createIndustry(values);
                error
                    ? toast.error("Something went wrong. Please try again.")
                    : toast.success("Industry created successfully.");
            }
            router.push("/settings/industries");
        } catch (error) {
            toast.error(
                error
                    ? "Something went wrong. Please try again."
                    : "Industry updated successfully."
            );
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
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter name" {...field} />
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
                    <Button type="submit" disabled={isLoading}>
                        {isLoading
                            ? "Saving..."
                            : industryId
                            ? "Update"
                            : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
