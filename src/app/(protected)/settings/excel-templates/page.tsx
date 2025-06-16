"use client";

import { ExcelTemplateManager } from "@/components/excel-setting/excel-template-manager";

export default function ExcelTemplatesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Excel Templates</h3>
                <p className="text-sm text-muted-foreground">
                    Manage Excel templates for data import and export.
                </p>
            </div>
            <ExcelTemplateManager />
        </div>
    );
}
