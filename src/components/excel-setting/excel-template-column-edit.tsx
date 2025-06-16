"use client";

import type React from "react";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ExcelTemplateColumn } from "@/types/excel_config";
import { API_URL } from "@/lib/constants";
import { useExcel } from "@/hooks/use-excel";

const columnSchema = z.object({
    name: z
        .string()
        .min(1, "Column name is required")
        .max(100, "Column name must be less than 100 characters")
        .regex(
            /^[a-zA-Z0-9\s_-]+$/,
            "Column name can only contain letters, numbers, spaces, underscores, and hyphens"
        ),
    dataType: z.enum(["string", "number", "date", "boolean", "decimal"], {
        required_error: "Please select a data type",
    }),
    required: z.boolean().optional(),
    validation: z
        .string()
        .max(200, "Validation rule must be less than 200 characters")
        .optional(),
});

type ColumnFormData = z.infer<typeof columnSchema>;

interface ColumnEditDialogProps {
    column?: ExcelTemplateColumn;
    templateId: string;
    onSave: () => void;
    trigger: React.ReactNode;
}

const dataTypeOptions = [
    { value: "string", label: "Text/String", description: "Text data" },
    { value: "number", label: "Number", description: "Numeric values" },
    { value: "date", label: "Date", description: "Date values" },
    { value: "boolean", label: "Boolean", description: "True/False values" },
    { value: "decimal", label: "Decimal", description: "Decimal values" },
];

export function ColumnEditDialog({
    column,
    templateId,
    onSave,
    trigger,
}: ColumnEditDialogProps) {
    const { createExcelTemplateColumn, updateExcelTemplateColumn } = useExcel();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = !!column;

    const form = useForm<ColumnFormData>({
        resolver: zodResolver(columnSchema),
        defaultValues: {
            name: column?.columnName || "",
            dataType: (column?.dataType || "string") as
                | "string"
                | "number"
                | "boolean"
                | "date"
                | "decimal",
            required: column?.isRequired || false,
            validation: column?.validationRegex || "",
        },
    });

    const onSubmit = async (data: ColumnFormData) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
            };
            let response;
            if (isEditing) {
                response = await updateExcelTemplateColumn(
                    Number(templateId),
                    column.id,
                    payload
                );
            } else {
                response = await createExcelTemplateColumn(
                    Number(templateId),
                    payload
                );
            }

            if (response) {
                toast.success(
                    `Column ${isEditing ? "updated" : "added"} successfully`
                );
                setOpen(false);
                form.reset();
                onSave();
            } else {
                throw new Error(
                    `Failed to ${isEditing ? "update" : "add"} column`
                );
            }
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : `Failed to ${isEditing ? "update" : "add"} column`
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const getDataTypeBadge = (dataType: string) => {
        const colors = {
            string: "bg-blue-100 text-blue-800",
            number: "bg-green-100 text-green-800",
            date: "bg-purple-100 text-purple-800",
            boolean: "bg-orange-100 text-orange-800",
            decimal: "bg-cyan-100 text-cyan-800",
        };

        return (
            <Badge
                variant="outline"
                className={
                    colors[dataType as keyof typeof colors] ||
                    "bg-gray-100 text-gray-800"
                }
            >
                {dataType}
            </Badge>
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Column" : "Add New Column"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the column configuration and properties."
                            : "Define a new column for this template."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Column Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter column name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The name of the column as it appears
                                            in the Excel/CSV file.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dataType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select data type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {dataTypeOptions.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {getDataTypeBadge(
                                                                    option.value
                                                                )}
                                                                <div>
                                                                    <div className="font-medium">
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {
                                                                            option.description
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            The expected data type for this
                                            column.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="required"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Required Field
                                            </FormLabel>
                                            <FormDescription>
                                                This column must have a value
                                                for each row.
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

                            <FormField
                                control={form.control}
                                name="validation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Validation Rule</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Max 50 characters"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Optional validation rule
                                            description.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {isEditing && (
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <h4 className="font-medium mb-2">
                                    Column Information
                                </h4>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>
                                        <strong>Position:</strong> Column{" "}
                                        {column.columnIndex}
                                    </p>
                                    <p>
                                        <strong>Current Type:</strong>{" "}
                                        {getDataTypeBadge(
                                            column.dataType as string
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}

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
                                {isSubmitting
                                    ? "Saving..."
                                    : isEditing
                                    ? "Update Column"
                                    : "Add Column"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
