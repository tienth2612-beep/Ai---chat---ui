"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Upload,
    FileSpreadsheet,
    AlertCircle,
    CheckCircle,
    Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useExcel } from "@/hooks/use-excel";
import {
    COMMON_STATUS,
    EXCEL_TARGET,
    getExcelTargetOptions,
} from "@/lib/constants";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const templateSchema = z.object({
    templateName: z
        .string()
        .min(1, "Template name is required")
        .max(100, "Template name must be less than 100 characters"),
    sheetName: z
        .string()
        .min(1, "Sheet name is required")
        .max(50, "Sheet name must be less than 50 characters"),
    type: z.enum(["0", "1"], {
        required_error: "Please select a type",
    }),
    target: z.string().min(1, "Target table is required"),
    status: z.enum(
        [
            COMMON_STATUS.WAITING_APPROVE.toString(),
            COMMON_STATUS.ACTIVE.toString(),
        ],
        {
            required_error: "Please select a status",
        }
    ),

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

type TemplateFormData = z.infer<typeof templateSchema>;

export function TemplateUploader() {
    const router = useRouter();
    const { error, uploadTemplate } = useExcel();
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<TemplateFormData>({
        resolver: zodResolver(templateSchema),
        defaultValues: {
            templateName: "",
            sheetName: "",
            type: undefined,
            target: "",
            status: COMMON_STATUS.WAITING_APPROVE.toString(),
            description: "",
            functionName: "",
            isFunction: false,
        },
    });

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            handleFile(droppedFile);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            handleFile(selectedFile);
        }
    };

    const handleFile = (selectedFile: File) => {
        // Check file type
        const fileType = selectedFile.name.split(".").pop()?.toLowerCase();
        if (!["csv", "xlsx", "xls"].includes(fileType || "")) {
            toast.error(
                "Please upload a valid Excel (.xlsx, .xls) or CSV (.csv) file."
            );
            return;
        }

        setFile(selectedFile);

        // Auto-fill sheet name if it's an Excel file
        if (["xlsx", "xls"].includes(fileType || "")) {
            form.setValue("sheetName", "Sheet1");
        } else {
            form.setValue(
                "sheetName",
                selectedFile.name.replace(/\.[^/.]+$/, "")
            );
        }
    };
    const isFunction = form.watch("isFunction");
    const onSubmit = async (data: TemplateFormData) => {
        if (!file) {
            toast.error("Please select a file to upload.");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("templateName", data.templateName);
            formData.append("sheetName", data.sheetName);
            formData.append("type", data.type);
            formData.append("target", data.target);
            formData.append("status", data.status);
            formData.append("description", data.description || "");
            formData.append("functionName", data.functionName || "");
            formData.append(
                "isFunction",
                data.isFunction?.toString() || "false"
            );
            const response = await uploadTemplate(formData);

            if (response) {
                toast.success("Template uploaded successfully!");
                // Reset form and file
                form.reset();
                setFile(null);
                router.push("/setting/excel-templates");
            } else {
                toast.error(error || "Failed to upload template.");
            }
        } catch (error) {
            toast.error("An error occurred while uploading the template.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        form.reset();
        setFile(null);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Template Configuration</CardTitle>
                    <CardDescription>
                        Fill in the template details and upload your Excel or
                        CSV file.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            <FormDescription>
                                                A unique name to identify this
                                                template.
                                            </FormDescription>
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
                                            <FormDescription>
                                                The name of the sheet/tab in the
                                                Excel file.
                                            </FormDescription>
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
                                                    <SelectItem value="0">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary">
                                                                Export
                                                            </Badge>
                                                            <span>
                                                                Export data from
                                                                system
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="1">
                                                        <div className="flex items-center gap-2">
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
                                            <FormDescription>
                                                Choose whether this template is
                                                for importing or exporting data.
                                            </FormDescription>
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
                                                                key={
                                                                    option.value
                                                                }
                                                                value={option.value.toString()}
                                                            >
                                                                {option.label}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                The database table this template
                                                will interact with.
                                            </FormDescription>
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
                                                    <SelectItem
                                                        value={COMMON_STATUS.WAITING_APPROVE.toString()}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary">
                                                                Waiting Approve
                                                            </Badge>
                                                            <span>
                                                                Requires
                                                                approval before
                                                                use
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={COMMON_STATUS.ACTIVE.toString()}
                                                    >
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
                                            <FormDescription>
                                                Set the initial status of this
                                                template.
                                            </FormDescription>
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

                            <Separator />

                            {/* Function Configuration Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">
                                    Function Configuration
                                </h3>

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
                                                    Enable this template to
                                                    execute custom functions
                                                    during data processing.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
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
                                                <FormLabel>
                                                    Function Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., processCustomerData"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    The name of the function to
                                                    execute. Must be a valid
                                                    identifier (letters,
                                                    numbers, underscores only).
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            <Separator />

                            <div>
                                <h3 className="text-lg font-medium mb-4">
                                    File Upload
                                </h3>
                                {!file ? (
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                            isDragging
                                                ? "border-primary bg-primary/10"
                                                : "border-muted-foreground/25"
                                        }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <Upload className="h-12 w-12 text-muted-foreground" />
                                            <div>
                                                <h4 className="font-medium text-lg">
                                                    Drag & drop your template
                                                    file here
                                                </h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Supports Excel (.xlsx, .xls)
                                                    and CSV (.csv) files
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            "file-upload"
                                                        )
                                                        ?.click()
                                                }
                                            >
                                                Browse Files
                                            </Button>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                accept=".csv,.xlsx,.xls"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border rounded-lg p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-primary/10 p-3 rounded-lg">
                                                <FileSpreadsheet className="h-8 w-8 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">
                                                    {file.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {(file.size / 1024).toFixed(
                                                        2
                                                    )}{" "}
                                                    KB •{" "}
                                                    {file.type ||
                                                        "Unknown type"}
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setFile(null)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={resetForm}
                                >
                                    Reset Form
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !file}
                                >
                                    {isSubmitting && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {isSubmitting
                                        ? "Uploading..."
                                        : "Upload Template"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
