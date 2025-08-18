"use client";

import type React from "react";

import { useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ExcelTemplateResponse } from "@/types/excel_config";
import { toast } from "sonner";
import { COMMON_STATUS, getExcelTargetOptions } from "@/lib/constants";
import { useExcel } from "@/hooks/use-excel";
import { Switch } from "@/components/ui/switch";

const editTemplateSchema = z.object({
    templateName: z
        .string()
        .min(1, "Template name is required")
        .max(100, "Template name must be less than 100 characters"),
    sheetName: z
        .string()
        .min(1, "Sheet name is required")
        .max(50, "Sheet name must be less than 50 characters"),
    type: z.enum(["export", "import"], {
        required_error: "Please select a type",
    }),
    target: z.string().min(1, "Target table is required"),
    status: z.enum(["waiting_approve", "active"], {
        required_error: "Please select a status",
    }),
    description: z
        .string()
        .max(500, "Description must be less than 500 characters")
        .optional(),
    functionName: z
        .string()
        .max(100, "Function name must be less than 100 characters")
        .regex(
            /^[a-zA-Z_][a-zA-Z0-9_]*$/,
            "Function name must be a valid identifier"
        )
        .optional()
        .or(z.literal("")),
    isFunction: z.boolean().default(false).optional(),
});

type EditTemplateFormData = z.infer<typeof editTemplateSchema>;

interface TemplateEditDialogProps {
    template: ExcelTemplateResponse;
    onSave: () => void;
    trigger: React.ReactNode;
}

export const TemplateEditDialog = forwardRef<
    HTMLDivElement,
    TemplateEditDialogProps
>(({ template, onSave, trigger }, ref) => {
    const { updateExcelTemplate } = useExcel();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<EditTemplateFormData>({
        resolver: zodResolver(editTemplateSchema),
        defaultValues: {
            templateName: template.name || "",
            sheetName: template.sheetName || "",
            type: template.type === 1 ? "export" : "import",
            target: template.target?.toString() || "",
            status:
                template.status === COMMON_STATUS.WAITING_APPROVE
                    ? "waiting_approve"
                    : "active",
            functionName: template.functionName || "",
            isFunction: template.isFunction || false,
            description: template.description || "",
        },
    });
    // Watch the isFunction field to conditionally show/hide functionName
    const isFunction = form.watch("isFunction");

    const onSubmit = async (data: EditTemplateFormData) => {
        setIsSubmitting(true);

        try {
            const response = await updateExcelTemplate(Number(template.id), {
                name: data.templateName,
                sheetName: data.sheetName,
                type: data.type === "export" ? 0 : 1,
                target: Number(data.target),
                status:
                    data.status === "waiting_approve"
                        ? COMMON_STATUS.WAITING_APPROVE
                        : COMMON_STATUS.ACTIVE,
                functionName: data.functionName,
                isFunction: data.isFunction,
                description: data.description,
            });

            if (response) {
                toast.success("Template updated successfully");
                resetForm();
            } else {
                throw new Error("Failed to update template");
            }
        } catch (error) {
            toast.error("Failed to update template");
        } finally {
            setIsSubmitting(false);
            setOpen(false);
            onSave();
        }
    };
    const resetForm = () => {
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="min-w-[60vw] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Template</DialogTitle>
                    <DialogDescription>
                        Update the template configuration and settings.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="templateName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Template Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter template name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="sheetName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sheet Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter sheet name"
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
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select template type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="export">
                                                    <div className="flex items-center gap-4">
                                                        <Badge variant="secondary">
                                                            Export
                                                        </Badge>
                                                        <span>
                                                            Export data from
                                                            system
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="import">
                                                    <div className="flex items-center gap-4">
                                                        <Badge variant="outline">
                                                            Import
                                                        </Badge>
                                                        <span>
                                                            Import data to
                                                            system
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="target"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Target Table</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select target table" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {getExcelTargetOptions().map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value.toString()}
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    )
                                                )}
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
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full md:w-[300px]">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="waiting_approve">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary">
                                                            Waiting Approve
                                                        </Badge>
                                                        <span>
                                                            Requires approval
                                                            before use
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="active">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="default">
                                                            Active
                                                        </Badge>
                                                        <span>
                                                            Ready to use
                                                            immediately
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>
                                            Description (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter template description..."
                                                className="resize-none"
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Provide additional details about
                                            this template.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* Function Configuration Section */}
                        <div className="md:col-span-2 space-y-4 border-t pt-4">
                            <h4 className="text-sm font-medium text-foreground">
                                Function Configuration
                            </h4>

                            <FormField
                                control={form.control}
                                name="isFunction"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Enable Function Mode
                                            </FormLabel>
                                            <FormDescription>
                                                Enable this template to execute
                                                custom functions during data
                                                processing.
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

                            {isFunction && (
                                <FormField
                                    control={form.control}
                                    name="functionName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Function Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., processCustomerData"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                The name of the function to
                                                execute. Must be a valid
                                                identifier (letters, numbers,
                                                underscores only).
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">
                                File Information
                            </h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>
                                    <strong>File Name:</strong>{" "}
                                    {template.fileName}
                                </p>
                                <p>
                                    <strong>Uploaded:</strong>{" "}
                                    {new Date(
                                        template.createAt
                                    ).toLocaleString()}
                                </p>
                                {template.isFunction && (
                                    <p>
                                        <strong>Current Function:</strong>{" "}
                                        {template.functionName || "Not set"}
                                    </p>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
});

TemplateEditDialog.displayName = "TemplateEditDialog";
