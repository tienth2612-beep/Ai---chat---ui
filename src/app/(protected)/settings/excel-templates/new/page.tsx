"use client";
import { TemplateUploader } from "@/components/excel-setting/excel-template-uploader";

export default function UploadTemplateExcel() {
    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Template Management System
                </h1>
                <p className="text-muted-foreground text-lg">
                    Upload and manage your Excel/CSV templates with detailed
                    configuration.
                </p>
            </div>
            <div className="mt-8">
                <TemplateUploader />
            </div>
        </div>
    );
}
